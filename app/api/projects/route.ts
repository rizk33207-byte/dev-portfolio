import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { projectSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (featured === "true") where.featured = true;

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: "asc" },
    });

    // Parse techStack JSON string back to array for each project
    const parsed = projects.map((p) => ({
      ...p,
      techStack: JSON.parse(p.techStack) as string[],
    }));

    return Response.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Projects GET error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { techStack, ...rest } = parsed.data;

    const project = await prisma.project.create({
      data: {
        ...rest,
        thumbnail: rest.thumbnail || null,
        videoUrl: rest.videoUrl || null,
        githubUrl: rest.githubUrl || null,
        liveUrl: rest.liveUrl || null,
        longDesc: rest.longDesc || null,
        techStack: JSON.stringify(techStack),
      },
    });

    revalidatePath("/");

    return Response.json(
      {
        success: true,
        data: { ...project, techStack: JSON.parse(project.techStack) as string[] },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Projects POST error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

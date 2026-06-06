import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { projectUpdateSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = projectUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { techStack, ...rest } = parsed.data;

    const updateData: Record<string, unknown> = {
      ...rest,
      // Normalize empty strings to null for optional URL fields
      thumbnail: rest.thumbnail !== undefined ? (rest.thumbnail || null) : undefined,
      videoUrl: rest.videoUrl !== undefined ? (rest.videoUrl || null) : undefined,
      githubUrl: rest.githubUrl !== undefined ? (rest.githubUrl || null) : undefined,
      liveUrl: rest.liveUrl !== undefined ? (rest.liveUrl || null) : undefined,
      longDesc: rest.longDesc !== undefined ? (rest.longDesc || null) : undefined,
    };
    // Remove keys with undefined value so Prisma doesn't overwrite unintentionally
    for (const key of Object.keys(updateData)) {
      if (updateData[key] === undefined) delete updateData[key];
    }
    if (techStack !== undefined) {
      updateData.techStack = JSON.stringify(techStack);
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");

    return Response.json({
      success: true,
      data: { ...project, techStack: JSON.parse(project.techStack) as string[] },
    });
  } catch (error) {
    console.error("Project PUT error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.project.delete({ where: { id } });
    revalidatePath("/");

    return Response.json({ success: true, data: { id } });
  } catch (error) {
    console.error("Project DELETE error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

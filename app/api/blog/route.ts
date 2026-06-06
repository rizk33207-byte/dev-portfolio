import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { blogPostSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const isAdmin = !!session;
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");

    if (slug) {
      const post = await prisma.blogPost.findUnique({ where: { slug } });
      if (!post || (!post.published && !isAdmin)) {
        return Response.json(
          { success: false, error: "Post not found" },
          { status: 404 }
        );
      }
      return Response.json({ success: true, data: post });
    }

    const posts = await prisma.blogPost.findMany({
      where: isAdmin ? {} : { published: true },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ success: true, data: posts });
  } catch (error) {
    console.error("Blog GET error:", error);
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
    const parsed = blogPostSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { slug: rawSlug, published, ...rest } = parsed.data;
    const slug = rawSlug || generateSlug(rest.title);

    // Ensure slug is unique
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const post = await prisma.blogPost.create({
      data: {
        ...rest,
        slug: finalSlug,
        published,
        publishedAt: published ? new Date() : null,
        coverImage: rest.coverImage ?? null,
      },
    });

    revalidatePath("/");

    return Response.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error("Blog POST error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

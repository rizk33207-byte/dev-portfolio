import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { blogPostUpdateSchema } from "@/lib/validations";
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
    const parsed = blogPostUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { published, ...rest } = parsed.data;

    const updateData: Record<string, unknown> = { ...rest };

    if (published !== undefined) {
      updateData.published = published;
      if (published) {
        // Only set publishedAt if not already set
        const existing = await prisma.blogPost.findUnique({ where: { id } });
        if (existing && !existing.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");

    return Response.json({ success: true, data: post });
  } catch (error) {
    console.error("Blog PUT error:", error);
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
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/");

    return Response.json({ success: true, data: { id } });
  } catch (error) {
    console.error("Blog DELETE error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

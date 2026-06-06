import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(
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

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });

    return Response.json({ success: true, data: message });
  } catch (error) {
    console.error("Mark-read error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

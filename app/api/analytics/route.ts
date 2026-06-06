import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyticsSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = analyticsSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Invalid page path" },
        { status: 400 }
      );
    }

    const { page } = parsed.data;
    const userAgent = request.headers.get("user-agent") ?? undefined;

    // Rate-limit: 1 view per page per hour (check most recent entry for this page)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await prisma.pageView.findFirst({
      where: {
        page,
        createdAt: { gte: oneHourAgo },
      },
      orderBy: { createdAt: "desc" },
    });

    if (recent) {
      return Response.json({ success: true, tracked: false });
    }

    await prisma.pageView.create({
      data: { page, userAgent: userAgent ?? null },
    });

    return Response.json({ success: true, tracked: true });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

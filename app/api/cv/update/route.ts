import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: "singleton" },
    });
    return Response.json({ success: true, data: { cvUrl: settings?.cvUrl ?? null } });
  } catch (error) {
    console.error("CV settings GET error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url } = body as { url?: string };

    if (!url || typeof url !== "string") {
      return Response.json(
        { success: false, error: "Missing or invalid url field" },
        { status: 400 }
      );
    }

    const settings = await prisma.settings.upsert({
      where: { id: "singleton" },
      update: { cvUrl: url },
      create: { id: "singleton", cvUrl: url },
    });

    return Response.json({ success: true, data: { cvUrl: settings.cvUrl } });
  } catch (error) {
    console.error("CV settings PATCH error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

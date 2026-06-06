import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

// GET — public: used by frontend components
export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: "singleton" },
    });
    return NextResponse.json({ success: true, data: settings });
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PATCH — admin only: update settings
export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Only allow known fields to be updated
    const allowedFields = [
      "phone", "email", "location", "website",
      "github", "linkedin", "twitter", "facebook", "instagram", "youtube",
    ];
    const sanitized: Record<string, string | null> = {};
    for (const key of allowedFields) {
      if (key in body) {
        sanitized[key] = body[key] || null;
      }
    }

    const settings = await prisma.settings.upsert({
      where: { id: "singleton" },
      update: sanitized,
      create: { id: "singleton", ...sanitized },
    });

    revalidatePath("/");
    revalidatePath("/api/settings");

    return NextResponse.json({ success: true, data: settings });
  } catch (err) {
    console.error("PATCH /api/settings error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save settings" },
      { status: 500 }
    );
  }
}

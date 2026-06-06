import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  try {
    const userAgent = request.headers.get("user-agent") ?? null;

    // Track the download
    await prisma.cvDownload.create({ data: { userAgent } });

    // Prefer the uploaded CV URL stored in Settings, fall back to static file
    const settings = await prisma.settings.findUnique({
      where: { id: "singleton" },
    });
    const cvUrl = settings?.cvUrl ?? "/cv/mahmoud-rizk-cv.pdf";

    redirect(cvUrl);
  } catch (error) {
    console.error("CV download error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}


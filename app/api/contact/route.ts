import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/email";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // Save to DB
    const saved = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    // Send email (non-blocking — don't fail the request if email fails)
    sendContactEmail({ name, email, subject, message }).catch((err) => {
      console.error("Email send failed:", err);
    });

    return Response.json({
      success: true,
      message: "Message sent!",
      data: { id: saved.id },
    });
  } catch (error) {
    console.error("Contact route error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

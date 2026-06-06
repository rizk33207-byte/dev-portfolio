import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const { name, email, subject, message } = data;

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL ?? process.env.GMAIL_USER,
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">New Contact Message</h2>
        <table style="width:100%; border-collapse:collapse;">
          <tr><td style="padding:8px; font-weight:bold;">From:</td><td style="padding:8px;">${name}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Email:</td><td style="padding:8px;">${email}</td></tr>
          <tr><td style="padding:8px; font-weight:bold;">Subject:</td><td style="padding:8px;">${subject}</td></tr>
        </table>
        <hr style="border-color:#eee; margin:16px 0;" />
        <h3>Message:</h3>
        <p style="white-space:pre-wrap; line-height:1.6;">${message}</p>
      </div>
    `,
    text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
  });
}

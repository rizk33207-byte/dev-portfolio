import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "../globals.css";
import { AdminI18nProvider } from "@/lib/admin-i18n";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard | Mahmoud Rizk",
  description: "Portfolio CMS Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-dark text-white min-h-full flex flex-col font-sans">
        <AdminI18nProvider>{children}</AdminI18nProvider>
      </body>
    </html>
  );
}

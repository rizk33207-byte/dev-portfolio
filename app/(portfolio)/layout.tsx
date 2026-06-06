import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  title: "Mahmoud Rizk | Full-Stack Developer",
  description: "Professional portfolio of Mahmoud Rizk, a Full-Stack Developer crafting scalable web applications with modern technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} scroll-smooth h-full antialiased`}
    >
      <body className="bg-bg-dark text-text-primary font-body min-h-full flex flex-col selection:bg-accent-blue/30 selection:text-text-primary">
        <Navbar />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

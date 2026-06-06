import { prisma } from "@/lib/prisma";
import FooterClient from "./FooterClient";

export default async function Footer() {
  const settings = await prisma.settings.findUnique({
    where: { id: "singleton" },
  });

  return (
    <FooterClient
      github={settings?.github ?? null}
      linkedin={settings?.linkedin ?? null}
      twitter={settings?.twitter ?? null}
    />
  );
}

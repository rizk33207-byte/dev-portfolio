import { prisma } from "@/lib/prisma";
import ContactSectionClient from "./ContactSectionClient";

export default async function ContactSection() {
  const settings = await prisma.settings.findUnique({
    where: { id: "singleton" },
  });

  return (
    <ContactSectionClient
      email={settings?.email ?? null}
      phone={settings?.phone ?? null}
      location={settings?.location ?? null}
      github={settings?.github ?? null}
      linkedin={settings?.linkedin ?? null}
      twitter={settings?.twitter ?? null}
    />
  );
}

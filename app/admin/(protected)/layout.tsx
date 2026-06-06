import { getSession } from "@/lib/session";
import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/lib/uploadthing";
import { AdminLayoutClient } from "./LayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <>
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      <AdminLayoutClient session={session} logoutAction={logout}>
        {children}
      </AdminLayoutClient>
    </>
  );
}

"use client";

import Link from "next/link";
import { useI18n } from "@/lib/admin-i18n";
import { LangToggle } from "@/components/admin/LangToggle";
import { usePathname } from "next/navigation";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  session: { name: string; email: string };
  logoutAction: () => Promise<void>;
}

export function AdminLayoutClient({
  children,
  session,
  logoutAction,
}: AdminLayoutClientProps) {
  const { t, isRTL } = useI18n();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-dark text-white flex font-sans">
      {/* Sidebar */}
      <aside
        className={`w-64 shrink-0 bg-surface flex flex-col ${
          isRTL ? "border-l" : "border-r"
        } border-white/10`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
              M
            </div>
            <div>
              <p className="font-bold text-sm text-white">
                {isRTL ? "لوحة التحكم" : "Admin Panel"}
              </p>
              <p className="text-xs text-white/50">Portfolio CMS</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <NavLink href="/admin" icon="🏠" label={t.nav.dashboard} active={pathname === "/admin"} />
          <NavLink href="/admin/projects" icon="📁" label={t.nav.projects} active={pathname === "/admin/projects"} />
          <NavLink href="/admin/blog" icon="📝" label={t.nav.blog} active={pathname === "/admin/blog"} />
          <NavLink href="/admin/cv" icon="📄" label={t.nav.cv} active={pathname === "/admin/cv"} />
          <NavLink href="/admin/messages" icon="💬" label={t.nav.messages} active={pathname === "/admin/messages"} />
          <NavLink href="/admin/analytics" icon="📊" label={t.nav.analytics} active={pathname === "/admin/analytics"} />
          <NavLink href="/admin/settings" icon="⚙️" label={t.nav.settings} active={pathname === "/admin/settings"} />
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <span>🚪</span>
              <span>{t.nav.logout}</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-white/10 bg-surface/80 backdrop-blur flex items-center justify-between px-6 shrink-0">
          <div />
          <div className="flex items-center gap-4">
            <LangToggle />
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/60">
                {isRTL ? "مرحباً،" : "Welcome,"}
              </span>
              <span className="text-sm font-semibold text-white">{session.name}</span>
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                {session.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="grow p-6">{children}</main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
        active
          ? "bg-white/10 text-white font-medium"
          : "text-white/70 hover:text-white hover:bg-white/5"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

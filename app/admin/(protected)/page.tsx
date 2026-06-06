import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./DashboardClient";

interface Stats {
  totalViews: number;
  viewsByPage: { page: string; count: number }[];
  viewsLast7Days: { date: string; count: number }[];
  totalMessages: number;
  unreadMessages: number;
  totalCvDownloads: number;
  totalProjects: number;
  totalBlogPosts: number;
}

async function getStats(): Promise<Stats> {
  const [
    totalViews,
    rawByPage,
    totalMessages,
    unreadMessages,
    totalCvDownloads,
    totalProjects,
    totalBlogPosts,
    recentViewsRaw,
  ] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.groupBy({ by: ["page"], _count: { page: true }, orderBy: { _count: { page: "desc" } } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.cvDownload.count(),
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.pageView.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      select: { createdAt: true },
    }),
  ]);

  const dayMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dayMap[d.toISOString().split("T")[0]] = 0;
  }
  recentViewsRaw.forEach(({ createdAt }) => {
    const key = createdAt.toISOString().split("T")[0];
    if (key in dayMap) dayMap[key]++;
  });

  return {
    totalViews,
    viewsByPage: rawByPage.map((r) => ({ page: r.page, count: r._count.page })),
    viewsLast7Days: Object.entries(dayMap).map(([date, count]) => ({ date, count })),
    totalMessages,
    unreadMessages,
    totalCvDownloads,
    totalProjects,
    totalBlogPosts,
  };
}

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [stats, recentMessages] = await Promise.all([
    getStats(),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  // Pass plain JSON data to client component
  const plainRecentMessages = recentMessages.map((msg) => ({
    id: msg.id,
    name: msg.name,
    email: msg.email,
    subject: msg.subject,
    message: msg.message,
    read: msg.read,
    createdAt: msg.createdAt.toISOString(),
  }));

  return (
    <DashboardClient
      sessionName={session.name}
      stats={stats}
      recentMessages={plainRecentMessages}
    />
  );
}

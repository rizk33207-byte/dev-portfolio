import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Total views
    const totalViews = await prisma.pageView.count();

    // Views grouped by page
    const rawByPage = await prisma.pageView.groupBy({
      by: ["page"],
      _count: { page: true },
      orderBy: { _count: { page: "desc" } },
    });
    const viewsByPage = rawByPage.map((r) => ({
      page: r.page,
      count: r._count.page,
    }));

    // Views last 7 days (grouped by date string)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentViews = await prisma.pageView.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const dayMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      dayMap[key] = 0;
    }
    recentViews.forEach(({ createdAt }) => {
      const key = createdAt.toISOString().split("T")[0];
      if (key in dayMap) dayMap[key]++;
    });
    const viewsLast7Days = Object.entries(dayMap).map(([date, count]) => ({
      date,
      count,
    }));

    // Aggregate counts
    const [totalMessages, unreadMessages, totalCvDownloads, totalProjects, totalBlogPosts] =
      await Promise.all([
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { read: false } }),
        prisma.cvDownload.count(),
        prisma.project.count(),
        prisma.blogPost.count(),
      ]);

    return Response.json({
      success: true,
      data: {
        totalViews,
        viewsByPage,
        viewsLast7Days,
        totalMessages,
        unreadMessages,
        totalCvDownloads,
        totalProjects,
        totalBlogPosts,
      },
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

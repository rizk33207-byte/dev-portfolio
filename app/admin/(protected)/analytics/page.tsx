"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/admin-i18n";

interface AnalyticsStats {
  totalViews: number;
  viewsByPage: { page: string; count: number }[];
  viewsLast7Days: { date: string; count: number }[];
  totalMessages: number;
  unreadMessages: number;
  totalCvDownloads: number;
  totalProjects: number;
  totalBlogPosts: number;
}

export default function AnalyticsPage() {
  const { t, isRTL } = useI18n();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics/stats");
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      } else {
        setError(json.error || (isRTL ? "فشل تحميل الإحصائيات" : "Failed to load analytics"));
      }
    } catch (err) {
      setError(isRTL ? "حدث خطأ أثناء جلب إحصائيات التحليل." : "An error occurred while fetching analytics stats.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white/50 text-sm">{t.common.loading}</div>;
  if (error) return <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>;
  if (!stats) return <div className="text-white/30 text-sm">{isRTL ? "لا توجد بيانات إحصائية متاحة." : "No analytics data available."}</div>;

  const maxDailyViews = Math.max(...stats.viewsLast7Days.map((d) => d.count), 1);
  const maxPageViews = Math.max(...stats.viewsByPage.map((p) => p.count), 1);

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white font-heading">{t.analytics.title}</h1>
        <p className="text-white/50 text-sm mt-1">
          {isRTL
            ? "مراقبة زيارات الموقع الإلكتروني، الصفحات الأكثر زيارة، ومؤشرات التحميل."
            : "Monitor website traffic, top pages, and download metrics."}
        </p>
      </div>

      {/* Traffic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur">
          <div className="text-2xl mb-2">👁️</div>
          <div className="text-3xl font-bold text-white">{stats.totalViews}</div>
          <div className="text-xs text-white/50 mt-1">{t.analytics.totalViews}</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur">
          <div className="text-2xl mb-2">📄</div>
          <div className="text-3xl font-bold text-white">{stats.totalCvDownloads}</div>
          <div className="text-xs text-white/50 mt-1">{t.analytics.cvDownloads}</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur">
          <div className="text-2xl mb-2">💬</div>
          <div className="text-3xl font-bold text-white">{stats.totalMessages}</div>
          <div className="text-xs text-white/50 mt-1">
            {t.dashboard.messages} ({stats.unreadMessages} {t.dashboard.unread})
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur">
          <div className="text-2xl mb-2">📂</div>
          <div className="text-3xl font-bold text-white">{stats.totalProjects}</div>
          <div className="text-xs text-white/50 mt-1">{isRTL ? "المشاريع النشطة" : "Active Projects"}</div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily views chart */}
        <div className="bg-surface border border-white/10 rounded-xl p-6 flex flex-col">
          <h2 className="text-sm font-semibold text-white/70 mb-6">
            {isRTL ? "سجل المشاهدات (آخر 7 أيام)" : "Views History (Last 7 Days)"}
          </h2>
          <div className="flex items-end gap-3 h-48 pt-6 pb-2">
            {stats.viewsLast7Days.map(({ date, count }) => (
              <div key={date} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip */}
                <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                  {count} {isRTL ? "مشاهدة" : "views"}
                </span>

                <div
                  className="w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-300"
                  style={{ height: `${(count / maxDailyViews) * 100}%`, minHeight: count > 0 ? "4px" : "2px" }}
                />

                <span className="text-[10px] text-white/40 block mt-1">
                  {new Date(date).toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top visited pages list */}
        <div className="bg-surface border border-white/10 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white/70 mb-4 font-heading">{t.analytics.topPages}</h2>
            <div className="space-y-4">
              {stats.viewsByPage.length === 0 && (
                <p className="text-white/30 text-sm">{isRTL ? "لم يتم تسجيل أي مشاهدات للصفحات بعد." : "No page views recorded yet."}</p>
              )}
              {stats.viewsByPage.map(({ page, count }) => {
                const percentage = (count / maxPageViews) * 100;
                return (
                  <div key={page} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white/75 truncate">{page}</span>
                      <span className="text-white font-semibold">
                        {count} {isRTL ? "مشاهدة" : "views"}
                      </span>
                    </div>
                    {/* Visual bar chart */}
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={fetchStats}
            type="button"
            className="w-full mt-6 py-2 border border-white/10 hover:bg-white/5 text-white/80 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            🔄 {isRTL ? "تحديث الإحصائيات" : "Refresh Stats"}
          </button>
        </div>
      </div>
    </div>
  );
}

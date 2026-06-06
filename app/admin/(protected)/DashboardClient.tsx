"use client";

import Link from "next/link";
import { useI18n } from "@/lib/admin-i18n";

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

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface DashboardClientProps {
  sessionName: string;
  stats: Stats;
  recentMessages: Message[];
}

export function DashboardClient({
  sessionName,
  stats,
  recentMessages,
}: DashboardClientProps) {
  const { t, isRTL } = useI18n();

  const maxViews = Math.max(...stats.viewsLast7Days.map((d) => d.count), 1);

  const statCards = [
    { label: t.dashboard.totalViews, value: stats.totalViews, icon: "👁️", color: "blue" },
    { label: t.dashboard.projects, value: stats.totalProjects, icon: "📁", color: "purple" },
    { label: t.dashboard.blogPosts, value: stats.totalBlogPosts, icon: "📝", color: "green" },
    { label: t.dashboard.messages, value: stats.totalMessages, icon: "💬", color: "yellow", badge: stats.unreadMessages },
    { label: t.dashboard.cvDownloads, value: stats.totalCvDownloads, icon: "📄", color: "pink" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-heading">{t.dashboard.title}</h1>
        <p className="text-white/50 text-sm mt-1">
          {t.dashboard.welcome}, {sessionName}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              {card.badge ? (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
                  {card.badge} {t.dashboard.unread}
                </span>
              ) : null}
            </div>
            <div className="text-3xl font-bold text-white">{card.value}</div>
            <div className="text-xs text-white/50 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* 7-day chart + recent messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
          <h2 className="text-sm font-semibold text-white/70 mb-4">
            {isRTL ? "الزيارات — آخر 7 أيام" : "Views — Last 7 Days"}
          </h2>
          <div className="flex items-end gap-2 h-32">
            {stats.viewsLast7Days.map(({ date, count }) => (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t"
                  style={{ height: `${(count / maxViews) * 100}%`, minHeight: count > 0 ? "4px" : "2px" }}
                />
                <span className="text-[10px] text-white/30 rotate-45 origin-left">
                  {date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent messages */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/70">{t.dashboard.recentMessages}</h2>
            <Link href="/admin/messages" className="text-xs text-blue-400 hover:text-blue-300">
              {isRTL ? "عرض الكل ←" : "View all →"}
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages.length === 0 && (
              <p className="text-white/30 text-sm">{t.messages.noMessages}</p>
            )}
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`px-3 py-2.5 rounded-lg text-sm border ${
                  !msg.read
                    ? "border-blue-500/30 bg-blue-500/5 border-l-2 border-l-blue-500"
                    : "border-white/5 bg-white/3"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{msg.name}</span>
                  <span className="text-[11px] text-white/30">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-white/50 text-xs truncate mt-0.5">{msg.subject}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-4">
        <Link
          href="/admin/projects"
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
        >
          {t.dashboard.addProject}
        </Link>
        <Link
          href="/admin/blog"
          className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors border border-white/10"
        >
          {t.dashboard.newPost}
        </Link>
      </div>
    </div>
  );
}

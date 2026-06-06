"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/admin-i18n";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const { t, isRTL } = useI18n();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const json = await res.json();
      if (json.success) {
        setMessages(json.data);
      } else {
        setError(json.error || (isRTL ? "فشل تحميل الرسائل" : "Failed to load messages"));
      }
    } catch (err) {
      setError(isRTL ? "حدث خطأ أثناء جلب الرسائل." : "An error occurred while fetching messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = async (msg: ContactMessage) => {
    if (expandedId === msg.id) {
      setExpandedId(null);
    } else {
      setExpandedId(msg.id);
      if (!msg.read) {
        // Mark as read in background
        try {
          const res = await fetch(`/api/admin/messages/${msg.id}/read`, {
            method: "PATCH",
          });
          const json = await res.json();
          if (json.success) {
            // Update local state
            setMessages((prev) =>
              prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
            );
          }
        } catch (err) {
          console.error("Failed to mark message as read:", err);
        }
      }
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/messages/${id}/read`, {
        method: "PATCH",
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: true } : m))
        );
      }
    } catch (err) {
      console.error("Failed to mark message as read:", err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white font-heading">{t.messages.title}</h1>
        <p className="text-white/50 text-sm mt-1">
          {isRTL
            ? "مراجعة الاستفسارات المقدمة عبر نموذج الاتصال بالملف الشخصي."
            : "Review inquiries submitted via the portfolio contact form."}
        </p>
      </div>

      {loading ? (
        <div className="text-white/50 text-sm">{t.common.loading}</div>
      ) : error ? (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-white/40 text-center py-10 bg-white/5 rounded-2xl border border-white/10">
          {t.messages.noMessages}
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const isExpanded = expandedId === msg.id;
            return (
              <div
                key={msg.id}
                onClick={() => handleToggleExpand(msg)}
                className={`bg-surface border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-white/20 ${
                  isExpanded ? "border-blue-500/50 ring-1 ring-blue-500/20" : "border-white/10"
                } ${!msg.read ? "border-l-2 border-l-blue-500" : ""}`}
              >
                {/* Header Summary */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">{msg.name}</span>
                      <span className="text-white/40 text-xs truncate max-w-xs">
                        &lt;{msg.email}&gt;
                      </span>
                      {!msg.read && (
                        <span className="text-[10px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                          {t.messages.unread}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-white/80 mt-1 truncate">
                      {msg.subject}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-xs text-white/30">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {!msg.read && (
                      <button
                        onClick={(e) => handleMarkAsRead(msg.id, e)}
                        type="button"
                        className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white/70 text-xs rounded transition-colors"
                      >
                        {t.messages.markRead}
                      </button>
                    )}
                    <span className="text-white/30 text-xs">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-white/1">
                    <div className="text-white/40 text-xs mb-3 flex flex-col gap-1">
                      <div>
                        <span className="font-semibold text-white/60">{t.messages.from}:</span> {msg.name} (
                        <a href={`mailto:${msg.email}`} className="text-blue-400 hover:underline">
                          {msg.email}
                        </a>
                        )
                      </div>
                      <div>
                        <span className="font-semibold text-white/60">{t.messages.date}:</span>{" "}
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed border-t border-white/5 pt-3">
                      {msg.message}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

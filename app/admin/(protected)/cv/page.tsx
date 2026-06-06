"use client";

import { useState, useEffect, useCallback } from "react";
import MediaUploader from "@/components/admin/MediaUploader";
import { useI18n } from "@/lib/admin-i18n";

export default function CvManagerPage() {
  const { t, isRTL } = useI18n();
  const [currentCvUrl, setCurrentCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCurrentCv = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cv/update");
      const json = await res.json();
      if (json.success) {
        setCurrentCvUrl(json.data.cvUrl ?? null);
      }
    } catch {
      // silently fail — UI shows "No CV uploaded"
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentCv();
  }, [fetchCurrentCv]);

  const handleCvUpdate = async (url: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/cv/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (json.success) {
        setCurrentCvUrl(url);
        showToast("success", t.cv.updated);
      } else {
        showToast("error", json.error || (isRTL ? "فشل تحديث السيرة الذاتية." : "Failed to update CV."));
      }
    } catch {
      showToast("error", isRTL ? "خطأ في الشبكة - يرجى المحاولة مرة أخرى." : "Network error — please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-heading">{t.cv.title}</h1>
        <p className="text-white/50 text-sm mt-1">
          {isRTL
            ? "قم برفع وإدارة ملف السيرة الذاتية العام بصيغة PDF."
            : "Upload and manage your public CV/résumé PDF."}
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`px-4 py-3 rounded-lg text-sm font-medium border transition-all ${
            toast.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
      )}

      {/* Current CV Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur space-y-4">
        <h2 className="text-base font-semibold text-white">{t.cv.current}</h2>

        {loading ? (
          <div className="flex items-center gap-2 text-white/40 text-sm py-4">
            <span className="animate-spin">⏳</span>
            <span>{t.common.loading}</span>
          </div>
        ) : currentCvUrl ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-4xl">📄</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {isRTL ? "تم رفع السيرة الذاتية" : "CV is uploaded"}
              </p>
              <p className="text-white/40 text-xs truncate mt-0.5">{currentCvUrl}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <a
                href={currentCvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
              >
                {isRTL ? "عرض الملف ↗" : "View PDF ↗"}
              </a>
              <a
                href="/api/cv/download"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs border border-white/10 hover:bg-white/5 text-white/80 rounded-lg font-medium transition-colors"
              >
                {isRTL ? "تجربة التحميل" : "Test Download"}
              </a>
            </div>
          </div>
        ) : (
          <div className="text-white/40 text-sm py-4 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
            {t.cv.noCv}. {isRTL
              ? "سيتم استخدام الملف الثابت كبديل."
              : "The static file will be used as a fallback."}{" "}
            <code className="text-white/60 text-xs">/cv/mahmoud-rizk-cv.pdf</code>
          </div>
        )}
      </div>

      {/* Upload New CV */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white">{t.cv.upload}</h2>
          <p className="text-white/40 text-xs mt-1">
            {isRTL
              ? "ملفات PDF فقط · 8 ميجابايت كحد أقصى · يستبدل الملف الحالي فوراً بعد الرفع."
              : "PDF only · max 8 MB · replaces the current file immediately after upload."}
          </p>
        </div>

        <MediaUploader
          endpoint="cvUpload"
          value={null}
          onChange={handleCvUpdate}
          accept="pdf"
          label={isRTL ? "اختر ملف السيرة الذاتية (PDF)" : "Select CV (PDF)"}
        />

        {saving && (
          <p className="text-blue-400 text-xs flex items-center gap-1.5">
            <span className="animate-spin">⏳</span> {isRTL ? "جاري الحفظ في قاعدة البيانات..." : "Saving to database…"}
          </p>
        )}
      </div>

      {/* Info footer */}
      <div className="px-4 py-3 bg-white/3 border border-white/8 rounded-xl text-xs text-white/40 leading-relaxed">
        <strong className="text-white/60">{isRTL ? "كيف يعمل هذا:" : "How it works:"}</strong>{" "}
        {isRTL
          ? "بعد الرفع، يتم حفظ الرابط الجديد في قاعدة البيانات. الزوار الذين ينقرون على \"تحميل السيرة الذاتية\" في ملفك الشخصي سيتم توجيههم إلى هذا الملف. وإذا لم يتم رفع أي ملف، يتم استخدام الملف الثابت كبديل."
          : "After uploading, the new URL is saved to the database. Visitors who click \"Download CV\" on your portfolio will be redirected to this file. If no file has been uploaded, the static PDF is used as the fallback."}
      </div>
    </div>
  );
}

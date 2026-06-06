"use client";

import { useI18n } from "@/lib/admin-i18n";

export function LangToggle() {
  const { lang, toggleLang } = useI18n();
  return (
    <button
      onClick={toggleLang}
      type="button"
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium transition-all cursor-pointer"
    >
      <span className="text-base" role="img" aria-label="flag">
        {lang === "en" ? "🇸🇦" : "🇬🇧"}
      </span>
      <span>{lang === "en" ? "العربية" : "English"}</span>
    </button>
  );
}

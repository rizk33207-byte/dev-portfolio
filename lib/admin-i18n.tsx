"use client";

import { createContext, useContext, useState, useEffect } from "react";
import en from "@/messages/admin/en.json";
import ar from "@/messages/admin/ar.json";

type Lang = "en" | "ar";
type Messages = typeof en;

const I18nContext = createContext<{
  lang: Lang;
  t: Messages;
  toggleLang: () => void;
  isRTL: boolean;
}>({
  lang: "en",
  t: en,
  toggleLang: () => {},
  isRTL: false,
});

export function AdminI18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin-lang") as Lang;
    if (saved) setLang(saved);
    setMounted(true);
  }, []);

  const toggleLang = () => {
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
    localStorage.setItem("admin-lang", next);
  };

  const t = lang === "en" ? en : ar;
  const isRTL = lang === "ar";

  // Prevent hydration mismatch by rendering a fallback structure or waiting until mounted.
  // We'll wrap the inner content to make sure it matches SSR on first paint.
  return (
    <I18nContext.Provider value={{ lang, t, toggleLang, isRTL }}>
      <div
        dir={mounted && isRTL ? "rtl" : "ltr"}
        style={{ fontFamily: mounted && isRTL ? "Cairo, sans-serif" : "inherit" }}
        className="w-full min-h-screen"
      >
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);

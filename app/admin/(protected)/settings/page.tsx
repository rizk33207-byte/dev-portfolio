"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/admin-i18n";

type SettingsForm = {
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
};

const defaultForm: SettingsForm = {
  email: "",
  phone: "",
  location: "",
  website: "",
  github: "",
  linkedin: "",
  twitter: "",
  facebook: "",
  instagram: "",
  youtube: "",
};

export default function SettingsPage() {
  const { t } = useI18n();
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          setForm({
            email: data.email ?? "",
            phone: data.phone ?? "",
            location: data.location ?? "",
            website: data.website ?? "",
            github: data.github ?? "",
            linkedin: data.linkedin ?? "",
            twitter: data.twitter ?? "",
            facebook: data.facebook ?? "",
            instagram: data.instagram ?? "",
            youtube: data.youtube ?? "",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: keyof SettingsForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm";

  const personalFields: { key: keyof SettingsForm; icon: string; placeholder: string }[] = [
    { key: "email", icon: "📧", placeholder: "mahmoud@example.com" },
    { key: "phone", icon: "📱", placeholder: "+20 100 000 0000" },
    { key: "location", icon: "📍", placeholder: "Cairo, Egypt" },
    { key: "website", icon: "🌐", placeholder: "https://mahmoud.dev" },
  ];

  const socialFields: { key: keyof SettingsForm; icon: string; placeholder: string }[] = [
    { key: "github", icon: "🐙", placeholder: "https://github.com/username" },
    { key: "linkedin", icon: "💼", placeholder: "https://linkedin.com/in/username" },
    { key: "twitter", icon: "🐦", placeholder: "https://twitter.com/username" },
    { key: "facebook", icon: "📘", placeholder: "https://facebook.com/username" },
    { key: "instagram", icon: "📸", placeholder: "https://instagram.com/username" },
    { key: "youtube", icon: "▶️", placeholder: "https://youtube.com/@channel" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-white/40">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-heading">{t.settings.title}</h1>
        <p className="text-white/50 text-sm mt-1">{t.settings.subtitle}</p>
      </div>

      {/* Toast */}
      {status === "saved" && (
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium">
          <span>✓</span>
          <span>{t.settings.saved}</span>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium">
          <span>✕</span>
          <span>{t.settings.error}</span>
        </div>
      )}

      {/* Section 1: Personal Information */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur space-y-5">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <span className="text-lg">👤</span>
          {t.settings.personalInfo}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {personalFields.map(({ key, icon, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                {icon} {t.settings[key as keyof typeof t.settings] as string}
              </label>
              <input
                type={key === "email" ? "email" : key === "website" || key === "github" || key === "linkedin" || key === "twitter" || key === "facebook" || key === "instagram" || key === "youtube" ? "url" : "text"}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Social Links */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur space-y-5">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <span className="text-lg">🔗</span>
          {t.settings.socialLinks}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialFields.map(({ key, icon, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                {icon} {t.settings[key as keyof typeof t.settings] as string}
              </label>
              <input
                type="url"
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
        >
          {status === "saving" ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t.settings.saving}
            </>
          ) : (
            <>
              <span>💾</span>
              {t.settings.save}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

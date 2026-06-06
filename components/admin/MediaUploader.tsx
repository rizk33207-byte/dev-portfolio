"use client";

import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { useState } from "react";

export const UploadButton = generateUploadButton<OurFileRouter>();

interface MediaUploaderProps {
  endpoint: keyof OurFileRouter;
  value: string | null;
  onChange: (url: string) => void;
  accept: "image" | "video" | "pdf";
  label: string;
}

export default function MediaUploader({
  endpoint,
  value,
  onChange,
  accept,
  label,
}: MediaUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const handleRemove = () => {
    onChange("");
  };

  const getFilename = (url: string) => {
    try {
      const decoded = decodeURIComponent(url);
      return decoded.substring(decoded.lastIndexOf("/") + 1);
    } catch {
      return "Uploaded File";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/70">{label}</span>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer"
          >
            Remove
          </button>
        )}
      </div>

      {value ? (
        <div className="relative rounded-xl border border-white/10 bg-white/5 overflow-hidden flex flex-col items-center justify-center p-4 min-h-[160px] group transition-all duration-300 hover:border-white/20">
          {accept === "image" && (
            <div className="relative w-full h-40 rounded-lg overflow-hidden">
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          {accept === "video" && (
            <div className="w-full rounded-lg overflow-hidden">
              <video src={value} controls className="w-full max-h-48 rounded-lg" />
            </div>
          )}

          {accept === "pdf" && (
            <div className="flex flex-col items-center gap-2 py-4">
              <span className="text-4xl">📄</span>
              <p className="text-xs text-white/80 font-medium max-w-xs truncate px-4">
                {getFilename(value)}
              </p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-all font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                View PDF ↗
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="relative rounded-xl border border-dashed border-white/10 bg-white/2 overflow-hidden flex flex-col items-center justify-center p-6 min-h-[160px] transition-all duration-300 hover:border-white/25">
          <UploadButton
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
              setError(null);
              if (res && res[0]) {
                onChange(res[0].url);
              }
            }}
            onUploadError={(err: Error) => {
              setError(err.message);
            }}
            className="ut-button:bg-blue-600 ut-button:hover:bg-blue-700
                       ut-button:text-white ut-button:rounded-lg
                       ut-button:px-4 ut-button:py-2
                       ut-allowed-content:text-slate-400"
            content={{
              button({ ready, isUploading }) {
                if (isUploading) return "Uploading...";
                return `Upload ${accept}`;
              },
            }}
          />
          {error && (
            <p className="text-red-400 text-xs mt-2 font-medium">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

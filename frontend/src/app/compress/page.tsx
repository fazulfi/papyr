"use client";

import { useState } from "react";
import PDFUploader from "@/components/PDFUploader";
import { config } from "@/lib/config";

/* ── Inline SVG Icons ── */

function CompressIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14h6v6M14 4h6v6M14 20h6v-6M4 4h6v6" />
      <path d="M10 14L4 20M20 4l-6 6" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ShieldIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/* ── Feature Badges ── */

const FEATURES = [
  { icon: <ZapIcon />, text: "Proses instan" },
  { icon: <ShieldIcon />, text: "Aman & privat" },
  { icon: <StarIcon />, text: "Kualitas terjaga" },
] as const;

/* ── Page ── */

export default function CompressPage() {
  const [isIdle, setIsIdle] = useState(true);

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      {/* Tool header */}
      <div className="mb-2.5 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <CompressIcon />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy">
          Kompres PDF
        </h1>
      </div>
      <p className="mb-7 text-[15px] leading-relaxed text-slate-500">
        Perkecil ukuran PDF tanpa mengurangi kualitas.
      </p>

      {/* Uploader */}
      <PDFUploader
        endpoint={`${config.apiUrl}/api/compress`}
        onUploadComplete={() => setIsIdle(false)}
        onReset={() => setIsIdle(true)}
      />

      {/* Feature badges — only visible in idle state */}
      {isIdle && (
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.text}
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-1"
            >
              <span className="text-accent">{f.icon}</span>
              <span className="text-sm font-medium text-slate-500">{f.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Privacy notice */}
      <div className="mt-5 flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-3">
        <span className="mt-0.5 text-slate-400">
          <ShieldIcon size={14} />
        </span>
        <p className="text-xs leading-relaxed text-slate-400">
          File kamu otomatis dihapus setelah 1 jam. Kami tidak pernah menyimpan dokumenmu.
        </p>
      </div>
    </div>
  );
}

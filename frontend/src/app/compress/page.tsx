"use client";

import { useState } from "react";
import PDFUploader from "@/components/PDFUploader";
import OtherTools from "@/components/OtherTools";
import PrivacyNotice from "@/components/PrivacyNotice";
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
  const [uploaderState, setUploaderState] = useState<string>("idle");

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      {/* Tool header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <CompressIcon />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-navy md:text-4xl">
          Kompres PDF
        </h1>
        <p className="text-base text-slate-500">
          Perkecil ukuran PDF tanpa mengurangi kualitas.
        </p>
        <p className="mt-2 text-sm text-slate-400 max-w-md">
          Cocok untuk kirim dokumen lewat WhatsApp, email kantor, atau upload ke portal pemerintah yang ada batas ukuran file.
        </p>
      </div>

      {/* Uploader */}
      <PDFUploader
        endpoint={`${config.apiUrl}/api/compress`}
        onStateChange={(state) => setUploaderState(state)}
      />

      {/* Privacy notice — always visible */}
      <PrivacyNotice model="server" />

      {/* Feature badges — only visible in idle state */}
      {uploaderState === "idle" && (
        <div className="animate-fade-up">
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.text}
                className="flex flex-col items-center rounded-2xl bg-white p-5 text-center border border-slate-100 shadow-sm"
              >
                <div className="text-accent mb-3">{f.icon}</div>
                <h3 className="text-sm font-semibold text-navy">{f.text}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
      <OtherTools currentTool="/compress" />
    </div>
  );
}

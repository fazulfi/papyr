"use client";

/**
 * STEP-F2-024: Type-mode signature component.
 *
 * Features:
 * - Text input with font family selector (4 Google Fonts)
 * - Color picker (black/blue only)
 * - Live canvas preview
 * - Exports base64 PNG via canvas.toDataURL
 * - Injects Google Fonts stylesheet on mount
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  SIGNATURE_FONTS,
  DEFAULT_SIGNATURE_FONT,
  injectSignatureFonts,
  renderSignatureText,
  type SignatureFont,
} from "@/app/sign/logic";

/* ── Types ── */

interface SignatureTypeProps {
  onSave: (signatureImage: string) => void;
}

type TypeStatus = "idle" | "ready" | "rendering" | "error";

/* ── Icons ── */

function TypeIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}

/* ── Colors (match SignaturePad) ── */

const SIGNATURE_COLORS = ["#000000", "#1E40AF"] as const;
type SignatureColor = (typeof SIGNATURE_COLORS)[number];

/* ── Component ── */

export default function SignatureType({ onSave }: SignatureTypeProps) {
  const [text, setText] = useState("");
  const [selectedFont, setSelectedFont] = useState<SignatureFont>(DEFAULT_SIGNATURE_FONT);
  const [selectedColor, setSelectedColor] = useState<SignatureColor>("#000000");
  const [status, setStatus] = useState<TypeStatus>("idle");
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Inject fonts once on mount
  useEffect(() => {
    injectSignatureFonts();
  }, []);

  // Render preview to off-screen canvas when params change
  const renderPreview = useCallback(async () => {
    if (!text.trim()) {
      setPreviewDataUrl(null);
      setStatus("idle");
      return;
    }

    setStatus("rendering");
    try {
      const dataUrl = await renderSignatureText(text, selectedFont.family, selectedColor);
      setPreviewDataUrl(dataUrl);
      setErrorMessage("");
      setStatus("ready");
    } catch {
      setErrorMessage("Gagal membuat preview tanda tangan. Coba lagi.");
      setStatus("error");
    }
  }, [text, selectedFont, selectedColor]);

  // Debounce preview rendering (avoid excessive re-renders on each keystroke)
  useEffect(() => {
    const timer = setTimeout(() => {
      renderPreview();
    }, 300);
    return () => clearTimeout(timer);
  }, [renderPreview]);

  const handleSave = useCallback(() => {
    if (status === "ready" && previewDataUrl) {
      onSave(previewDataUrl);
    }
  }, [status, previewDataUrl, onSave]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Controls */}
      <div className="mb-4 space-y-4">
        {/* Text input */}
        <label className="block space-y-2 text-sm font-medium text-navy">
          <span>Nama tanda tangan</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Contoh: Muhammad Fa'iz"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        {/* Font selector */}
        <label className="block space-y-2 text-sm font-medium text-navy">
          <span>Font tanda tangan</span>
          <select
            value={selectedFont.family}
            onChange={(e) => {
              const font = SIGNATURE_FONTS.find((f) => f.family === e.target.value);
              if (font) setSelectedFont(font);
            }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            {SIGNATURE_FONTS.map((font) => (
              <option key={font.family} value={font.family}>
                {font.label}
              </option>
            ))}
          </select>
        </label>

        {/* Color selector */}
        <label className="block space-y-2 text-sm font-medium text-navy">
          <span>Warna</span>
          <div className="flex gap-3">
            {SIGNATURE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "scale-110 border-accent shadow-sm"
                    : "border-slate-300 hover:border-slate-400"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Warna ${color === "#000000" ? "Hitam" : "Biru"}`}
                aria-pressed={selectedColor === color}
              />
            ))}
          </div>
        </label>
      </div>

      {/* Preview (rounded-2xl container like draw mode) */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        {status === "idle" || !previewDataUrl ? (
          <div className="flex aspect-[560/200] max-h-40 items-center justify-center">
            <p className="text-sm text-slate-400">Nama tanda tangan akan muncul di sini</p>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={previewDataUrl}
            alt="Preview tanda tangan"
            className="mx-auto max-h-32 w-auto object-contain"
          />
        )}

        {(status === "rendering" || status === "error") && errorMessage && (
          <div className="mt-2 flex items-center gap-2 justify-center text-sm text-rose-500">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setText("");
            setSelectedFont(DEFAULT_SIGNATURE_FONT);
            setSelectedColor("#000000");
            setErrorMessage("");
            setStatus("idle");
            setPreviewDataUrl(null);
          }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={status !== "ready"}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Gunakan Tanda Tangan
        </button>
      </div>
    </div>
  );
}
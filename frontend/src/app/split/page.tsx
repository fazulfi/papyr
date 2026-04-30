"use client";

import { useState, useRef, useCallback } from "react";
import { formatFileSize } from "@/lib/format";
import { limits } from "@/lib/config";
import { getPDFPageCount, splitPDF, downloadPDF } from "@/lib/pdfUtils";
import PageRangeInput from "@/components/PageRangeInput";
import { trackTaskStarted, trackTaskCompleted, trackTaskFailed } from "@/lib/analytics";
import OtherTools from "@/components/OtherTools";
import PrivacyNotice from "@/components/PrivacyNotice";

/* ── Types ── */

type SplitState = "idle" | "loading" | "ready" | "processing" | "done" | "error";

/* ── Inline SVG Icons ── */

function SplitIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16" y1="3" x2="16" y2="21" />
      <line x1="16" y1="12" x2="22" y2="6" />
      <line x1="16" y1="12" x2="22" y2="18" />
      <path d="M8 21H4a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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

function ZapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

/* ── Feature Badges ── */

const FEATURES = [
  { icon: <ZapIcon />, text: "Proses di browser" },
  { icon: <LockIcon />, text: "Tanpa upload server" },
  { icon: <ShieldIcon />, text: "Privasi terjaga" },
] as const;

/* ── Page ── */

export default function SplitPage() {
  const [splitState, setSplitState] = useState<SplitState>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rangeRaw, setRangeRaw] = useState("");
  const [rangeError, setRangeError] = useState(false);
  const [splitData, setSplitData] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── File Selection ── */

  const handleFile = useCallback(async (f: File) => {
    // Validate
    if (f.type !== "application/pdf") {
      setErrorMessage(`"${f.name}" bukan file PDF.`);
      setSplitState("error");
      return;
    }
    if (f.size > limits.maxUploadBytes) {
      setErrorMessage(`"${f.name}" terlalu besar (maks ${limits.maxUploadMB}MB).`);
      setSplitState("error");
      return;
    }
    if (f.size === 0) {
      setErrorMessage(`"${f.name}" kosong.`);
      setSplitState("error");
      return;
    }

    setFile(f);
    setSplitState("loading");
    setErrorMessage("");

    try {
      const count = await getPDFPageCount(f);
      setTotalPages(count);
      setSplitState("ready");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Gagal membaca file PDF.",
      );
      setSplitState("error");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  /* ── Range Change ── */

  const handleRangeChange = useCallback((pages: number[], raw: string) => {
    setSelectedPages(pages);
    setRangeRaw(raw);
    // If raw is non-empty but pages is empty and there's no parse error,
    // it means the input is being typed. We track error via the component.
    setRangeError(raw.trim() !== "" && pages.length === 0);
  }, []);

  /* ── Split ── */

  const canSplit =
    splitState === "ready" &&
    selectedPages.length > 0 &&
    !rangeError;

  const handleSplit = useCallback(async () => {
    if (!file || selectedPages.length === 0) return;

    setSplitState("processing");
    setErrorMessage("");
    trackTaskStarted("split");

    try {
      const result = await splitPDF(file, selectedPages);
      setSplitData(result);
      setSplitState("done");
      trackTaskCompleted("split");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal memisahkan PDF. Silakan coba lagi.";
      setErrorMessage(msg);
      setSplitState("error");
      trackTaskFailed("split", "server_error");
    }
  }, [file, selectedPages]);

  const handleDownload = useCallback(() => {
    if (splitData) {
      // Build filename from range
      const filename = rangeRaw.trim()
        ? `split_${rangeRaw.trim().replace(/\s+/g, "").replace(/,/g, "_")}.pdf`
        : "split_pages.pdf";
      downloadPDF(splitData, filename);
    }
  }, [splitData, rangeRaw]);

  const resetAll = useCallback(() => {
    setFile(null);
    setSplitState("idle");
    setTotalPages(0);
    setSelectedPages([]);
    setRangeRaw("");
    setRangeError(false);
    setSplitData(null);
    setErrorMessage("");
    setDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const removeFile = useCallback(() => {
    setFile(null);
    setSplitState("idle");
    setTotalPages(0);
    setSelectedPages([]);
    setRangeRaw("");
    setRangeError(false);
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  /* ── Render ── */

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      {/* Tool header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <SplitIcon />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-navy md:text-4xl">
          Pisahkan PDF
        </h1>
        <p className="text-base text-slate-500">
          Ambil halaman tertentu dari dokumen PDF.
        </p>
        <p className="mt-2 text-sm text-slate-400 max-w-md">
          Ambil halaman yang kamu butuhkan dari laporan, skripsi, atau e-book tanpa perlu download ulang seluruh file.
        </p>
      </div>

      {/* Done state */}
      {splitState === "done" && splitData && (
        <div className="animate-fade-up rounded-2xl border border-accent/20 bg-white p-6 shadow-[0_4px_20px_rgba(37,99,235,0.06)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <CheckIcon />
            </div>
            <div>
              <p className="text-base font-semibold text-navy">
                PDF berhasil dipisahkan!
              </p>
              <p className="text-xs text-slate-500">
                {selectedPages.length} halaman · {formatFileSize(splitData.length)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="mb-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-4 text-base font-semibold text-white shadow-[0_2px_12px_rgba(37,99,235,0.25)] transition-colors hover:bg-accent/90"
          >
            <DownloadIcon />
            Unduh PDF
          </button>

          <button
            type="button"
            onClick={resetAll}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-transparent px-5 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
          >
            <RefreshIcon />
            Pisahkan file lain
          </button>
        </div>
      )}

      {/* Processing state */}
      {splitState === "processing" && (
        <div className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-6">
          <p className="mb-2.5 text-sm font-medium text-slate-500">
            Sedang memisahkan {selectedPages.length} halaman...
          </p>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="absolute inset-0 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-accent to-transparent bg-[length:200%_100%]" />
          </div>
          <p className="mt-2.5 text-center text-xs text-slate-400">
            Proses berjalan di browser — file tidak dikirim ke server.
          </p>
        </div>
      )}

      {/* Error state */}
      {splitState === "error" && (
        <div className="animate-fade-up mb-4 rounded-2xl border border-rose-200 bg-rose-50/50 p-6">
          <div className="mb-4 flex items-center gap-3 text-rose-500">
            <AlertIcon />
            <p className="text-sm font-semibold">Terjadi Kesalahan</p>
          </div>
          <p className="mb-5 text-sm text-slate-600">{errorMessage}</p>
          <button
            type="button"
            onClick={() => {
              setSplitState(file && totalPages > 0 ? "ready" : "idle");
              setErrorMessage("");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading state (reading PDF) */}
      {splitState === "loading" && (
        <div className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-6">
          <p className="mb-2.5 text-sm font-medium text-slate-500">
            Membaca dokumen PDF...
          </p>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="absolute inset-0 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-accent to-transparent bg-[length:200%_100%]" />
          </div>
        </div>
      )}

      {/* Ready state — file info + range input */}
      {splitState === "ready" && file && (
        <div className="animate-fade-up space-y-4">
          {/* File info */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="shrink-0 text-accent">
              <FileIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy">
                {file.name}
              </p>
              <p className="text-xs text-slate-400">
                {totalPages} halaman · {formatFileSize(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="shrink-0 rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
              aria-label="Hapus file"
            >
              <XIcon />
            </button>
          </div>

          {/* Page range input */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <PageRangeInput
              totalPages={totalPages}
              onChange={handleRangeChange}
            />
          </div>

          {/* Split button */}
          <button
            type="button"
            onClick={handleSplit}
            disabled={!canSplit}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-semibold transition-colors ${
              canSplit
                ? "bg-accent text-white shadow-[0_2px_12px_rgba(37,99,235,0.25)] hover:bg-accent/90"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            Pisahkan PDF
          </button>

          {!canSplit && rangeRaw.trim() === "" && (
            <p className="text-center text-xs text-slate-400">
              Masukkan halaman yang ingin dipilih.
            </p>
          )}
        </div>
      )}

      {/* Idle state — upload zone */}
      {splitState === "idle" && (
        <div className="animate-fade-up">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-2xl border-2 border-dashed bg-white px-5 py-14 text-center transition-all ${
              dragging
                ? "border-accent bg-accent/5"
                : "border-slate-300 hover:border-accent/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  handleFile(f);
                  e.target.value = "";
                }
              }}
            />
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <UploadIcon />
            </div>
            <p className="mb-2 text-base font-semibold tracking-tight text-navy">
              Seret PDF ke sini atau klik untuk memilih
            </p>
            <p className="text-xs text-slate-400">
              Maks {limits.maxUploadMB}MB · Hanya file PDF
            </p>
          </div>

          {/* Feature badges */}
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

          {/* Other tools */}
          <OtherTools currentTool="/split" />
        </div>
      )}

      {/* Privacy notice — always visible */}
      <PrivacyNotice model="client" />
    </div>
  );
}

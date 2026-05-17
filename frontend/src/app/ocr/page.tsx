"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PrivacyNotice from "@/components/PrivacyNotice";
import OtherTools from "@/components/OtherTools";
import { useAsyncTask } from "@/hooks/useAsyncTask";
import { trackTaskCompleted, trackTaskFailed, trackTaskStarted } from "@/lib/analytics";
import { limits, config } from "@/lib/config";
import { formatFileSize } from "@/lib/format";

const TOOL_NAME = "ocr" as Parameters<typeof trackTaskStarted>[0];
const MAX_PDF_PAGES = 50;

type OcrLanguage = "ind" | "eng" | "ind+eng";

interface OcrResult {
  download_url: string;
  original_size: number;
  output_size: number;
  expires_at: string;
  pages_processed: number;
  language_used: string;
}

/* ── Inline SVG Icons ── */

function OcrIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M8 12h8" />
      <path d="M8 8h4" />
      <path d="M8 16h6" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

/* ── Helpers ── */

function formatCountdown(expiresAt: string | undefined, now: number) {
  if (!expiresAt) return "-";
  const expiresMs = new Date(expiresAt).getTime();
  if (Number.isNaN(expiresMs)) return expiresAt;
  const diff = expiresMs - now;
  if (diff <= 0) return "Kedaluwarsa";
  const totalSeconds = Math.floor(diff / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getLanguageLabel(lang: OcrLanguage): string {
  switch (lang) {
    case "ind": return "Bahasa Indonesia";
    case "eng": return "English";
    case "ind+eng": return "Indonesia + English";
  }
}

const LANGUAGE_OPTIONS: OcrLanguage[] = ["ind", "eng", "ind+eng"];

/* ── Validation ── */

function getFileValidationError(file: File): string | null {
  const isPdfMime = limits.allowedPdfMimeTypes.includes(file.type as (typeof limits.allowedPdfMimeTypes)[number]);
  const hasPdfExtension = /\.pdf$/i.test(file.name);

  if (!isPdfMime && !hasPdfExtension) {
    return `"${file.name}" bukan file PDF.`;
  }

  if (file.size > limits.maxUploadBytes) {
    return `"${file.name}" terlalu besar (maks ${limits.maxUploadMB}MB).`;
  }

  if (file.size === 0) {
    return `"${file.name}" kosong.`;
  }

  return null;
}

/* ── Page ── */

export default function OcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const [language, setLanguage] = useState<OcrLanguage>("ind+eng");
  const [estimatedSeconds, setEstimatedSeconds] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { state, submit, reset } = useAsyncTask(`${config.apiUrl}/api/ocr`, {
    statusBaseUrl: `${config.apiUrl}/api`,
  });

  const result = state.result as OcrResult | null;
  const isBusy = state.status === "submitting" || state.status === "queued" || state.status === "processing";
  const showUploadZone = !file && state.status === "idle";
  const showFileSelected = Boolean(file) && (state.status === "idle" || state.status === "failed" || state.status === "timeout");

  const progressValue = useMemo(() => {
    if (typeof state.progress === "number") return Math.max(0, Math.min(100, state.progress));
    if (state.status === "queued") return 15;
    if (state.status === "processing") return 65;
    if (state.status === "done") return 100;
    return 0;
  }, [state.progress, state.status]);

  const countdownLabel = useMemo(() => formatCountdown(result?.expires_at, now), [result?.expires_at, now]);

  useEffect(() => {
    if (!result?.expires_at) return;
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [result?.expires_at]);

  useEffect(() => {
    if (state.status === "done") {
      trackTaskCompleted(TOOL_NAME, { language_used: result?.language_used });
    }
  }, [state.status, result?.language_used]);

  useEffect(() => {
    if ((state.status === "failed" || state.status === "timeout") && state.error) {
      trackTaskFailed(TOOL_NAME, state.error);
    }
  }, [state.status, state.error]);

  const handleFileSelect = useCallback((selectedFile?: File) => {
    if (!selectedFile) return;
    const validationError = getFileValidationError(selectedFile);
    if (validationError) {
      setFile(null);
      setErrorMessage(validationError);
      reset();
      return;
    }
    setFile(selectedFile);
    setErrorMessage("");
    reset();
    setEstimatedSeconds(null);
  }, [reset]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    handleFileSelect(event.dataTransfer.files?.[0]);
  }, [handleFileSelect]);

  const handleConvert = useCallback(async () => {
    if (!file || isBusy) return;

    const validationError = getFileValidationError(file);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    // Estimate before submission
    const est = Math.min(180, Math.max(30, (file.size / (1024 * 1024)) * 10));
    setEstimatedSeconds(est);
    setErrorMessage("");
    trackTaskStarted(TOOL_NAME, { language });

    try {
      const response = await fetch(`${config.apiUrl}/api/ocr`, {
        method: "POST",
        body: formData,
      });

      const body = await response.json().catch(() => null);

      if (response.status !== 202) {
        const detail = body?.detail || body?.error || `Server error (${response.status})`;
        throw new Error(detail);
      }

      if (typeof body?.estimated_seconds === "number") {
        setEstimatedSeconds(body.estimated_seconds);
      }

      // Submit to polling hook using the task_id from the 202 response
      await submit(new FormData());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengirim file.");
      trackTaskFailed(TOOL_NAME, error instanceof Error ? error.message : "submit_failed");
    }
  }, [file, isBusy, submit, language]);

  const handleReset = useCallback(() => {
    setFile(null);
    setErrorMessage("");
    setDragging(false);
    setEstimatedSeconds(null);
    setLanguage("ind+eng");
    reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [reset]);

  const handleRetry = useCallback(() => {
    setErrorMessage("");
    reset();
    setEstimatedSeconds(null);
  }, [reset]);

  const combinedErrorMessage = errorMessage || state.error;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      {/* Tool header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <OcrIcon />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-navy md:text-4xl">
          OCR PDF
        </h1>
        <p className="text-base text-slate-500">
          Ekstrak teks dari file PDF gambar atau scan menjadi dokumen Word (.docx).
        </p>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          Cocok untuk dokumen scan, foto dokumen, atau PDF berisi gambar teks.
          File diproses di server dan otomatis dihapus setelah 1 jam.
        </p>
        <p className="mt-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
          Maksimal {MAX_PDF_PAGES} halaman · Estimasi 30 detik – 3 menit
        </p>
      </div>

      {/* Upload zone */}
      {showUploadZone && (
        <div className="animate-fade-up space-y-6">
          <div
            className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
              dragging
                ? "border-accent bg-accent/5"
                : "border-slate-200 bg-white hover:border-accent/50"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload file PDF"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click();
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(event) => handleFileSelect(event.target.files?.[0])}
              aria-hidden="true"
            />
            <UploadIcon className="mx-auto mb-4 h-10 w-10 text-slate-400" />
            <p className="text-sm text-slate-500">
              <span className="font-medium text-accent">Klik untuk upload</span>{" "}
              atau seret file PDF di sini
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Maksimal {limits.maxUploadMB}MB · Hingga {MAX_PDF_PAGES} halaman
            </p>
          </div>

          {combinedErrorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <AlertIcon className="mr-2 inline" />
              {combinedErrorMessage}
            </div>
          )}
        </div>
      )}

      {/* File selected — language & convert */}
      {showFileSelected && file && (
        <div className="animate-fade-up space-y-4">
          {/* File info */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <FileIcon className="h-8 w-8 shrink-0 text-slate-400" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy">{file.name}</p>
              <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
            </div>
          </div>

          {/* Language selection */}
          <div>
            <p className="mb-2 text-sm font-medium text-navy">Pilih Bahasa OCR</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Bahasa OCR">
              {LANGUAGE_OPTIONS.map((lang) => (
                <label
                  key={lang}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    language === lang
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-slate-200 text-slate-600 hover:border-accent/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="ocr-language"
                    value={lang}
                    checked={language === lang}
                    onChange={() => setLanguage(lang)}
                    className="sr-only"
                    aria-label={getLanguageLabel(lang)}
                  />
                  {getLanguageLabel(lang)}
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1">
              <InfoIcon className="shrink-0" />
              Pilih bahasa berdasarkan isi dokumen untuk hasil terbaik
            </p>
          </div>

          {combinedErrorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <AlertIcon className="mr-2 inline" />
              {combinedErrorMessage}
            </div>
          )}

          <button
            type="button"
            onClick={handleConvert}
            disabled={!file || isBusy}
            className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ekstrak Teks (OCR)
          </button>
        </div>
      )}

      {/* Submitting */}
      {state.status === "submitting" && (
        <div className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-accent" />
          <p className="text-sm text-slate-500">Mengunggah file PDF...</p>
        </div>
      )}

      {/* Queued / Processing */}
      {(state.status === "queued" || state.status === "processing") && file && (
        <div className="animate-fade-up space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <FileIcon className="h-8 w-8 shrink-0 text-slate-400" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy">{file.name}</p>
              <p className="text-xs text-slate-400">
                Bahasa: {getLanguageLabel(language)} · {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-accent" />
            <p className="text-sm font-medium text-slate-700">Memproses OCR...</p>
            <p className="mt-1 text-xs text-slate-400">
              {state.status === "queued"
                ? "Tugas masuk ke antrean pemrosesan."
                : "OCR sedang berjalan di server."}
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>{state.status === "queued" ? "Dalam antrean" : "Sedang diproses"}</span>
              <span>{progressValue}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>

          {estimatedSeconds !== null && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
              Estimasi waktu: sekitar {estimatedSeconds} detik.
            </div>
          )}
        </div>
      )}

      {/* Done */}
      {state.status === "done" && result && (
        <div className="animate-fade-up space-y-4">
          <div className="flex items-center justify-center rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
              <CheckIcon />
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500">Ukuran asli</span>
              <span className="text-right font-medium text-navy">
                {typeof result.original_size === "number" ? formatFileSize(result.original_size) : "-"}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500">Ukuran output</span>
              <span className="text-right font-medium text-navy">
                {typeof result.output_size === "number" ? formatFileSize(result.output_size) : "-"}
              </span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500">Halaman diproses</span>
              <span className="text-right font-medium text-navy">{result.pages_processed ?? "-"}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500">Bahasa OCR</span>
              <span className="text-right font-medium text-navy">{result.language_used ?? "-"}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500">Link berlaku</span>
              <span className="text-right font-medium text-navy">{countdownLabel}</span>
            </div>
          </div>

          <a
            href={result.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent/90"
          >
            <DownloadIcon className="-mt-0.5" />
            Download File Word
          </a>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
          >
            <RefreshIcon />
            OCR File Lain
          </button>
        </div>
      )}

      {/* Failed / Timeout */}
      {(state.status === "failed" || state.status === "timeout") && file && (
        <div className="animate-fade-up space-y-4">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <AlertIcon className="mr-2 inline" />
            {combinedErrorMessage || "Terjadi kesalahan saat memproses OCR."}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleRetry}
              className="flex-1 rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent/90"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      <PrivacyNotice model="server" />
      <OtherTools currentTool="/ocr" />
    </div>
  );
}
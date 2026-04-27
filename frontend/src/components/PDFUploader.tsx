"use client";

import { useState, useRef, useCallback } from "react";
import { formatFileSize, formatPercent } from "@/lib/format";

/* ── Types ── */

interface CompressResult {
  download_url: string;
  original_size: number;
  compressed_size: number;
  saved_percent: number;
}

type UploadState = "idle" | "uploading" | "processing" | "done" | "error";

interface PDFUploaderProps {
  endpoint: string;
  maxSizeMB?: number;
  accept?: string;
  onUploadComplete?: (result: CompressResult) => void;
  onReset?: () => void;
  onStateChange?: (state: UploadState) => void;
}

/* ── Inline SVG Icons ── */

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
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

/* ── Component ── */

export default function PDFUploader({
  endpoint,
  maxSizeMB = 20,
  accept = "application/pdf",
  onUploadComplete,
  onReset,
  onStateChange,
}: PDFUploaderProps) {
  const [state, setInternalState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [retrying, setRetrying] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const setState = useCallback((newState: UploadState) => {
    setInternalState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  const resetState = useCallback(() => {
    setState("idle");
    setProgress(0);
    setFileName("");
    setFileSize(0);
    setResult(null);
    setErrorMessage("");
    setRetrying(false);
    setDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onReset?.();
  }, [onReset]);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!file.type || !accept.split(",").some((t) => file.type === t.trim())) {
        return "Tipe file tidak valid. Hanya file PDF yang diterima.";
      }
      if (file.size === 0) {
        return "File kosong.";
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB.`;
      }
      return null;
    },
    [accept, maxSizeMB],
  );

  const uploadFile = useCallback(
    (file: File, isRetry = false) => {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setProgress(pct);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data: CompressResult = JSON.parse(xhr.responseText);
            setResult(data);
            setState("done");
            onUploadComplete?.(data);
          } catch {
            handleError("Gagal memproses respons server.", file, isRetry);
          }
        } else if (xhr.status === 429) {
          setErrorMessage("Terlalu banyak permintaan. Coba lagi dalam 1 menit.");
          setState("error");
        } else if (xhr.status >= 400 && xhr.status < 500) {
          // Client/validation error — no retry
          try {
            const body = JSON.parse(xhr.responseText);
            setErrorMessage(body.detail || "File terlalu besar untuk diproses.");
          } catch {
            setErrorMessage("File terlalu besar untuk diproses.");
          }
          setState("error");
        } else {
          // Server error — retry eligible
          handleError("Gagal memproses file. Silakan coba lagi.", file, isRetry);
        }
      });

      xhr.addEventListener("error", () => {
        handleError("Gagal memproses file. Silakan coba lagi.", file, isRetry);
      });

      xhr.addEventListener("timeout", () => {
        handleError("Koneksi timeout. Silakan coba lagi.", file, isRetry);
      });

      xhr.upload.addEventListener("loadend", () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
          setState("processing");
        }
      });

      xhr.open("POST", `${endpoint}?quality=ebook`);
      xhr.timeout = 120000; // 2 minutes
      xhr.send(formData);

      setState("uploading");
      setProgress(0);
    },
    [endpoint, onUploadComplete],
  );

  const handleError = useCallback(
    (message: string, file: File, isRetry: boolean) => {
      if (!isRetry) {
        // First failure — auto-retry after 1 second
        setRetrying(true);
        setState("uploading");
        setTimeout(() => {
          setRetrying(false);
          uploadFile(file, true);
        }, 1000);
      } else {
        // Second failure — show error
        setErrorMessage(message);
        setState("error");
      }
    },
    [uploadFile],
  );

  const handleFileSelect = useCallback(
    (file: File | undefined) => {
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        setFileName(file.name);
        setFileSize(file.size);
        setErrorMessage(validationError);
        setState("error");
        return;
      }

      setFileName(file.name);
      setFileSize(file.size);
      uploadFile(file);
    },
    [validateFile, uploadFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    },
    [handleFileSelect],
  );

  /* ── Render States ── */

  if (state === "idle") {
    return (
      <div className="animate-fade-up">
        {/* Upload zone */}
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
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <UploadIcon />
          </div>
          <p className="mb-2 text-base font-semibold tracking-tight text-navy">
            Seret PDF ke sini
            <br />
            atau klik untuk upload
          </p>
          <p className="text-xs text-slate-400">
            Maks {maxSizeMB}MB · Hanya file PDF · Dihapus dalam 1 jam
          </p>
        </div>
      </div>
    );
  }

  if (state === "uploading") {
    return (
      <div className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-6">
        {/* File info */}
        <div className="mb-7 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <FileIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy">{fileName}</p>
            <p className="text-xs text-slate-400">{formatFileSize(fileSize)}</p>
          </div>
        </div>

        {/* Progress */}
        <p className="mb-2.5 text-sm font-medium text-slate-500">
          {retrying ? "Mencoba ulang..." : `Mengunggah... ${progress}%`}
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  if (state === "processing") {
    return (
      <div className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-6">
        {/* File info */}
        <div className="mb-7 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <FileIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy">{fileName}</p>
            <p className="text-xs text-slate-400">{formatFileSize(fileSize)} asli</p>
          </div>
        </div>

        {/* Shimmer progress */}
        <p className="mb-2.5 text-sm font-medium text-slate-500">Sedang mengompres...</p>
        <div className="relative h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="absolute inset-0 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-accent to-transparent bg-[length:200%_100%]" />
        </div>
        <p className="mt-2.5 text-center text-xs text-slate-400">
          Mengoptimalkan gambar dan stream...
        </p>
      </div>
    );
  }

  if (state === "done" && result) {
    const saved = formatPercent(result.original_size, result.compressed_size);

    return (
      <div className="animate-fade-up rounded-2xl border border-accent/20 bg-white p-6 shadow-[0_4px_20px_rgba(37,99,235,0.06)]">
        {/* Success header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500">
            <CheckIcon />
          </div>
          <div>
            <p className="text-base font-semibold text-navy">Kompresi selesai!</p>
            <p className="text-xs text-slate-500">{fileName}</p>
          </div>
        </div>

        {/* Before / After */}
        <div className="mb-5 rounded-xl bg-slate-50 px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Sebelum
              </p>
              <p className="text-2xl font-semibold tracking-tight text-slate-500">
                {formatFileSize(result.original_size)}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-bold text-accent">
                &minus;{saved}%
              </span>
              <ArrowRightIcon />
            </div>
            <div className="text-center">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent/80">
                Sesudah
              </p>
              <p className="text-2xl font-semibold tracking-tight text-navy">
                {formatFileSize(result.compressed_size)}
              </p>
            </div>
          </div>
        </div>

        {/* Download button */}
        <a
          href={result.download_url}
          download
          className="mb-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-4 text-base font-semibold text-white shadow-[0_2px_12px_rgba(37,99,235,0.25)] transition-colors hover:bg-accent/90"
        >
          <DownloadIcon />
          Unduh PDF yang Dikompres
        </a>

        {/* Reset button */}
        <button
          type="button"
          onClick={resetState}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-transparent px-5 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
        >
          <RefreshIcon />
          Kompres file lain
        </button>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="animate-fade-up rounded-2xl border border-rose-200 bg-rose-50/50 p-6">
        <div className="mb-4 flex items-center gap-3 text-rose-500">
          <AlertIcon />
          <p className="text-sm font-semibold">Terjadi Kesalahan</p>
        </div>
        <p className="mb-5 text-sm text-slate-600">{errorMessage}</p>
        <button
          type="button"
          onClick={resetState}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return null;
}

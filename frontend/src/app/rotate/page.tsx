"use client";

import { useState, useRef, useCallback } from "react";
import { formatFileSize } from "@/lib/format";
import { limits } from "@/lib/config";
import {
  getPDFPageCount,
  rotatePDF,
  downloadPDF,
  type PageRotationMap,
} from "@/lib/pdfUtils";
import {
  trackTaskStarted,
  trackTaskCompleted,
  trackTaskFailed,
} from "@/lib/analytics";
import OtherTools from "@/components/OtherTools";
import PrivacyNotice from "@/components/PrivacyNotice";

/* ── Types ── */

type RotateState = "idle" | "loading" | "ready" | "processing" | "done" | "error";

/* ── Inline SVG Icons ── */

function RotateIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6" />
      <path d="M21.34 13.72A10 10 0 113.07 8.63" />
      <path d="M21.5 8L21.34 13.72" />
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
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function RotateCWIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

/* ── Feature Badges ── */

const FEATURES = [
  { icon: <ZapIcon />, text: "Proses di browser" },
  { icon: <LockIcon />, text: "Tanpa upload server" },
  { icon: <ShieldIcon />, text: "Privasi terjaga" },
];

/* ── Rotation Label Helper ── */

function rotationLabel(deg: number): string {
  const n = ((deg % 360) + 360) % 360;
  if (n === 0) return "0°";
  if (n === 90) return "90°";
  if (n === 180) return "180°";
  if (n === 270) return "270°";
  return `${n}°`;
}

/* ── Page Component ── */

export default function RotatePage() {
  const [state, setState] = useState<RotateState>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotations, setRotations] = useState<Map<number, number>>(new Map());
  const [errorMsg, setErrorMsg] = useState("");
  const [resultData, setResultData] = useState<Uint8Array | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── File Handling ── */

  const handleFile = useCallback(async (f: File) => {
    // Validate type
    if (f.type !== "application/pdf") {
      setErrorMsg("File bukan PDF. Pilih file dengan format .pdf.");
      setState("error");
      trackTaskFailed("rotate", "invalid_file");
      return;
    }
    // Validate size
    if (f.size > limits.maxUploadBytes) {
      setErrorMsg(`Ukuran file melebihi batas ${limits.maxUploadMB}MB.`);
      setState("error");
      trackTaskFailed("rotate", "file_too_large");
      return;
    }
    // Validate not empty
    if (f.size === 0) {
      setErrorMsg("File kosong. Pilih file PDF yang valid.");
      setState("error");
      trackTaskFailed("rotate", "empty_file");
      return;
    }

    setState("loading");
    try {
      const count = await getPDFPageCount(f);
      setFile(f);
      setPageCount(count);
      // Initialize all rotations to 0
      const initMap = new Map<number, number>();
      for (let i = 1; i <= count; i++) {
        initMap.set(i, 0);
      }
      setRotations(initMap);
      setState("ready");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal membaca file PDF.");
      setState("error");
      trackTaskFailed("rotate", "read_error");
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
      e.target.value = "";
    },
    [handleFile],
  );

  /* ── Rotation Controls ── */

  const rotatePage = (pageNum: number) => {
    setRotations((prev) => {
      const next = new Map(prev);
      const current = next.get(pageNum) ?? 0;
      next.set(pageNum, (current + 90) % 360);
      return next;
    });
  };

  const rotateAll = (deg: number) => {
    setRotations((prev) => {
      const next = new Map(prev);
      for (const [key, val] of next) {
        next.set(key, (val + deg) % 360);
      }
      return next;
    });
  };

  /* ── Process ── */

  const hasChanges = Array.from(rotations.values()).some((v) => v !== 0);

  const handleRotate = async () => {
    if (!file || !hasChanges) return;

    setState("processing");
    trackTaskStarted("rotate");

    try {
      // Build the rotation map (only pages with non-zero rotation)
      const map: PageRotationMap = new Map();
      for (const [pageNum, deg] of rotations) {
        if (deg !== 0) {
          map.set(pageNum, deg);
        }
      }

      const result = await rotatePDF(file, map);
      setResultData(result);
      setState("done");
      trackTaskCompleted("rotate");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal memutar PDF.");
      setState("error");
      trackTaskFailed("rotate", err instanceof Error ? err.message : "unknown");
    }
  };

  /* ── Download ── */

  const handleDownload = () => {
    if (!resultData || !file) return;
    downloadPDF(resultData, `rotated_${file.name}`);
  };

  /* ── Reset ── */

  const reset = () => {
    setState("idle");
    setFile(null);
    setPageCount(0);
    setRotations(new Map());
    setErrorMsg("");
    setResultData(null);
  };

  /* ── Render ── */

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent/15 text-accent">
          <RotateIcon />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Putar PDF
          </h1>
          <p className="text-sm text-slate-500">
            Putar halaman PDF sesuai kebutuhan.
          </p>
          <p className="mt-1 text-sm text-slate-400 max-w-md">
            Cocok untuk memperbaiki orientasi dokumen scan, foto, atau halaman yang terbalik.
          </p>
        </div>
      </div>

      {/* Feature badges */}
      <div className="mb-6 flex flex-wrap gap-3">
        {FEATURES.map((f) => (
          <span
            key={f.text}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500"
          >
            <span className="text-accent">{f.icon}</span>
            {f.text}
          </span>
        ))}
      </div>

      {/* ── IDLE: Upload Zone ── */}
      {state === "idle" && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-14 text-center transition-colors hover:border-accent/60 hover:bg-accent/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <UploadIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy">
              Seret PDF ke sini atau klik untuk memilih
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Maks {limits.maxUploadMB}MB · Format PDF
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      )}

      {/* ── LOADING ── */}
      {state === "loading" && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-14">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-sm text-slate-500">Membaca halaman PDF...</p>
        </div>
      )}

      {/* ── READY: Page Grid + Controls ── */}
      {state === "ready" && file && (
        <div className="space-y-4">
          {/* File info */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <FileIcon />
              </div>
              <div>
                <p className="text-sm font-medium text-navy truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {formatFileSize(file.size)} · {pageCount} halaman
                </p>
              </div>
            </div>
            <button
              onClick={reset}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Hapus file"
            >
              <XIcon />
            </button>
          </div>

          {/* Global rotation buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => rotateAll(90)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-accent/50 hover:text-accent"
            >
              <RotateCWIcon /> Putar Semua 90°
            </button>
            <button
              onClick={() => rotateAll(180)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-accent/50 hover:text-accent"
            >
              <RotateCWIcon /> Putar Semua 180°
            </button>
            <button
              onClick={() => rotateAll(270)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-accent/50 hover:text-accent"
            >
              <RotateCWIcon /> Putar Semua 270°
            </button>
          </div>

          {/* Page grid */}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {Array.from({ length: pageCount }, (_, i) => {
              const pageNum = i + 1;
              const deg = rotations.get(pageNum) ?? 0;
              const isRotated = deg !== 0;

              return (
                <button
                  key={pageNum}
                  onClick={() => rotatePage(pageNum)}
                  className={`group relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all hover:border-accent/60 ${
                    isRotated
                      ? "border-accent/40 bg-accent/5"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {/* Page thumbnail placeholder */}
                  <div
                    className="flex h-16 w-12 items-center justify-center rounded bg-slate-100 text-xs font-medium text-slate-400 transition-transform"
                    style={{ transform: `rotate(${deg}deg)` }}
                  >
                    <FileIcon />
                  </div>
                  <span className="text-xs font-medium text-slate-600">
                    Hal {pageNum}
                  </span>
                  {isRotated && (
                    <span className="text-[10px] font-semibold text-accent">
                      {rotationLabel(deg)}
                    </span>
                  )}
                  {/* Hover hint */}
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <RotateCWIcon />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Process button */}
          <button
            onClick={handleRotate}
            disabled={!hasChanges}
            className={`w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-sm transition-all ${
              hasChanges
                ? "bg-navy hover:-translate-y-0.5 hover:shadow-md"
                : "cursor-not-allowed bg-slate-300"
            }`}
          >
            {hasChanges
              ? `Putar ${Array.from(rotations.values()).filter((v) => v !== 0).length} halaman`
              : "Pilih halaman untuk diputar"}
          </button>
        </div>
      )}

      {/* ── PROCESSING ── */}
      {state === "processing" && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white px-6 py-14">
          {/* Shimmer bar */}
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-1/3 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-accent" />
          </div>
          <p className="text-sm text-slate-500">Memutar halaman PDF...</p>
          <p className="text-xs text-slate-400">Proses berjalan di browser</p>
        </div>
      )}

      {/* ── DONE ── */}
      {state === "done" && resultData && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500">
            <CheckIcon />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-emerald-800">
              PDF berhasil diputar!
            </p>
            <p className="mt-1 text-sm text-emerald-600">
              {Array.from(rotations.values()).filter((v) => v !== 0).length} halaman diputar
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <DownloadIcon /> Unduh PDF
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-accent"
          >
            <RefreshIcon /> Putar file lain
          </button>
        </div>
      )}

      {/* ── ERROR ── */}
      {state === "error" && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-rose-200 bg-rose-50 px-6 py-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-500">
            <AlertIcon />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-rose-800">
              Terjadi kesalahan
            </p>
            <p className="mt-1 text-sm text-rose-600">{errorMsg}</p>
          </div>
          <button
            onClick={file ? () => setState("ready") : reset}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <RefreshIcon /> Coba Lagi
          </button>
        </div>
      )}

      {/* Privacy notice */}
      <div className="mt-8">
        <PrivacyNotice model="client" />
      </div>

      {/* Other tools */}
      <OtherTools currentTool="/rotate" />
    </div>
  );
}

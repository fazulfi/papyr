"use client";

import { useState, useRef, useCallback } from "react";
import { formatFileSize } from "@/lib/format";
import { trackTaskStarted, trackTaskCompleted, trackTaskFailed } from "@/lib/analytics";
import { config } from "@/lib/config";
import PrivacyNotice from "@/components/PrivacyNotice";
import OtherTools from "@/components/OtherTools";
import PasswordInput from "@/components/PasswordInput";
import {
  getProtectFailureReason,
  validateProtectFile,
  validateProtectPassword,
} from "./logic";

/* ── Inline SVG Icons ── */

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function LockOpenIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 019.9-1" />
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

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
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


/* ── Types ── */

type ProtectState = "idle" | "file-selected" | "uploading" | "processing" | "done" | "error";

interface ProtectResult {
  success: boolean;
  download_url: string;
  expires_at: string;
  original_size: number;
  output_size: number;
}

/* ── Shimmer Animation ── */

function Shimmer() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
      <div className="h-4 w-1/2 rounded bg-slate-200 animate-pulse" />
      <div className="h-4 w-5/6 rounded bg-slate-200 animate-pulse" />
    </div>
  );
}

/* ── Encryption Method Badge ── */

function EncryptionBadge({ method }: { method: string }) {
  const isAES256 = method === "aes256";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
      isAES256
        ? "bg-green-100 text-green-800"
        : "bg-blue-100 text-blue-800"
    }`}>
      {isAES256 ? "AES-256" : "AES-128"}
    </span>
  );
}

/* ── Page Component ── */

export default function ProtectPage() {
  const [state, setState] = useState<ProtectState>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [encryption, setEncryption] = useState<"aes128" | "aes256">("aes256");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProtectResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [retrying, setRetrying] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const validateFile = useCallback(
    (f: File): string | null => validateProtectFile(f),
    [],
  );

  const validatePassword = useCallback(
    (): string | null => validateProtectPassword(password, confirmPassword),
    [password, confirmPassword],
  );

  const handleError = useCallback(
    (message: string, isRetry: boolean) => {
      if (!isRetry) {
        setRetrying(true);
        setState("uploading");
        setTimeout(() => {
          setRetrying(false);
          sendRequest(true);
        }, 1000);
      } else {
        setErrorMessage(message);
        setState("error");
        trackTaskFailed("protect", "server_error");
      }
    },
    [],
  );

  const sendRequest = useCallback(
    (isRetry = false) => {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);
      formData.append("encryption", encryption);

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
            const data: ProtectResult = JSON.parse(xhr.responseText);
            setResult(data);
            setState("done");
            trackTaskCompleted("protect");
          } catch {
            handleError("Gagal memproses respons server.", isRetry);
          }
        } else if (xhr.status >= 400 && xhr.status < 500) {
          const failureReason = getProtectFailureReason(xhr.status);

          if (xhr.status === 429) {
            setErrorMessage("Terlalu banyak permintaan. Coba lagi dalam 1 menit.");
          } else if (xhr.status === 409) {
            try {
              const body = JSON.parse(xhr.responseText);
              setErrorMessage(body.detail || "PDF sudah terenkripsi.");
            } catch {
              setErrorMessage("PDF sudah terenkripsi.");
            }
          } else {
            try {
              const body = JSON.parse(xhr.responseText);
              setErrorMessage(body.detail || "Terjadi kesalahan validasi.");
            } catch {
              setErrorMessage("Terjadi kesalahan validasi.");
            }
          }

          setState("error");
          trackTaskFailed("protect", failureReason);
        } else {
          handleError("Gagal memproses file. Silakan coba lagi.", isRetry);
        }
      });

      xhr.addEventListener("error", () => {
        handleError("Gagal memproses file. Silakan coba lagi.", isRetry);
      });

      xhr.addEventListener("timeout", () => {
        handleError("Koneksi timeout. Silakan coba lagi.", isRetry);
      });

      xhr.upload.addEventListener("loadend", () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
          setState("processing");
        }
      });

      xhr.open("POST", `${config.apiUrl}/api/protect`);
      xhr.timeout = 120000;
      xhr.send(formData);

      setState("uploading");
      setProgress(0);
      if (!isRetry) trackTaskStarted("protect");
    },
    [file, password, encryption, handleError],
  );

  const handleFileSelect = useCallback(
    (f: File | undefined) => {
      if (!f) return;
      const err = validateFile(f);
      if (err) {
        setErrorMessage(err);
        setState("error");
        return;
      }
      setFile(f);
      setErrorMessage("");
      setState("file-selected");
    },
    [validateFile],
  );

  const handleSubmit = useCallback(() => {
    const err = validatePassword();
    if (err) {
      setErrorMessage(err);
      return;
    }
    setErrorMessage("");
    sendRequest();
  }, [validatePassword, sendRequest]);

  const handleReset = useCallback(() => {
    setState("idle");
    setFile(null);
    setPassword("");
    setConfirmPassword("");
    setEncryption("aes256");
    setProgress(0);
    setResult(null);
    setErrorMessage("");
    setRetrying(false);
    setDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files?.[0];
      handleFileSelect(f);
    },
    [handleFileSelect],
  );

  const handlePasteClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      {/* Tool header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <LockIcon />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-navy md:text-4xl">
          Proteksi PDF
        </h1>
        <p className="text-base text-slate-500">
          Lindungi file PDF Anda dengan sandi AES-256.
        </p>
        <p className="mt-2 text-sm text-slate-400 max-w-md">
          Tambahkan kata sandi untuk mengunci PDF Anda. File akan dienkripsi
          dan tersedia untuk diunduh selama 1 jam.
        </p>
      </div>

      {/* Upload area */}
      {state === "idle" && (
        <div
          className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
            dragging
              ? "border-accent bg-accent/5"
              : "border-slate-200 hover:border-accent/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={handlePasteClick}
          role="button"
          tabIndex={0}
          aria-label="Upload area"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handlePasteClick();
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
            aria-hidden="true"
          />
          <UploadIcon className="mx-auto mb-4 h-10 w-10 text-slate-400" />
          <p className="text-sm text-slate-500">
            <span className="font-medium text-accent">Klik untuk upload</span>{" "}
            atau seret file PDF di sini
          </p>
          <p className="mt-1 text-xs text-slate-400">Maksimal 20MB</p>
        </div>
      )}

      {/* File selected — password form */}
      {state === "file-selected" && file && (
        <div className="animate-fade-up space-y-4">
          {/* File info */}
          <div className="flex items-center gap-3 rounded-xl bg-white p-4 border border-slate-100 shadow-sm">
            <FileIcon className="h-8 w-8 text-slate-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy">{file.name}</p>
              <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
            </div>
          </div>

          {/* Password inputs */}
<PasswordInput
             password={password}
             confirmPassword={confirmPassword}
             onPasswordChange={setPassword}
             onConfirmChange={setConfirmPassword}
             showConfirm
             minLength={4}
           />

          {/* Encryption selector */}
          <div className="space-y-3 rounded-xl bg-white p-4 border border-slate-100 shadow-sm">
            <label className="text-sm font-medium text-navy">Metode Enkripsi</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "aes256", label: "AES-256", desc: "Lebih aman" },
                { value: "aes128", label: "AES-128", desc: "Lebih cepat" },
              ].map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setEncryption(m.value as "aes128" | "aes256")}
                  className={`rounded-xl border-2 p-3 text-left transition-colors ${
                    encryption === m.value
                      ? "border-accent bg-accent/5"
                      : "border-slate-200 hover:border-accent/30"
                  }`}
                >
                  <p className="text-sm font-semibold text-navy">{m.label}</p>
                  <p className="text-xs text-slate-400">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
              <AlertIcon className="inline mr-2" />
              {errorMessage}
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={retrying}
            className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {retrying ? "Mencoba lagi..." : "Proteksi PDF"}
          </button>
        </div>
      )}

      {/* Uploading */}
      {state === "uploading" && (
        <div className="animate-fade-up text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-accent" />
          <p className="text-sm text-slate-500 mb-2">Sedang mengunggah...</p>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{progress}%</p>
        </div>
      )}

      {/* Processing */}
      {state === "processing" && (
        <div className="animate-fade-up space-y-4 text-center">
          <div className="mx-auto h-10 w-10"><Shimmer /></div>
          <p className="text-sm text-slate-500">Sedang mengenkripsi file Anda...</p>
        </div>
      )}

      {/* Done */}
      {state === "done" && result && (
        <div className="animate-fade-up space-y-4">
          <div className="flex items-center justify-center rounded-2xl bg-green-50 p-4 border border-green-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckIcon />
            </div>
          </div>
          <div className="rounded-xl bg-white p-4 border border-slate-100 shadow-sm space-y-3">
            {result.original_size && result.output_size && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Ukuran asli</span>
                <span className="font-medium text-navy">{formatFileSize(result.original_size)}</span>
              </div>
            )}
            {result.output_size && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Ukuran terenkripsi</span>
                <span className="font-medium text-navy">{formatFileSize(result.output_size)}</span>
              </div>
            )}
            {result.expires_at && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Link berlalu</span>
                <span className="font-medium text-navy">{result.expires_at}</span>
              </div>
            )}
          </div>
          <a
            href={result.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-xl bg-accent py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-accent/90 transition-colors inline-block"
          >
            <DownloadIcon className="inline mr-2 -mt-0.5" />
            Unduh File Terenkripsi
          </a>
          <button
            onClick={handleReset}
            className="w-full rounded-xl bg-slate-100 py-3 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Proteksi File Lain
          </button>
        </div>
      )}

      {/* Error state */}
      {state === "error" && (
        <div className="animate-fade-up space-y-4">
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            <AlertIcon className="inline mr-2 mb-1" />
            <p>{errorMessage}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={() => {
                setRetrying(false);
                setState("file-selected");
                setErrorMessage("");
              }}
              className="flex-1 rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Privacy notice — always visible */}
      <PrivacyNotice model="server" />

      {/* Other tools */}
      <OtherTools currentTool="/protect" />
    </div>
  );
}

'use client';

/**
 * STEP-F2-024: Upload-mode signature component.
 *
 * Features:
 * - Drag-and-drop or click-to-upload PNG/JPG signature images (max 1MB)
 * - Preview the selected image before saving
 * - Produces `signatureImage` as base64 PNG via canvas resize
 * - Follows existing rounded-2xl / rounded-xl / rounded-full visual conventions
 */

import { useCallback, useRef, useState } from 'react';
import { validateSignatureImageFile, imageFileToBase64Png } from '@/app/sign/logic';

/* ── Types ── */

interface SignatureUploadProps {
  onSave: (signatureImage: string) => void;
}

type UploadStatus = 'idle' | 'preview' | 'loading' | 'error';

/* ── Icons ── */

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
    </svg>
  );
}

/* ── Component ── */

export default function SignatureUpload({ onSave }: SignatureUploadProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;

    const validationError = validateSignatureImageFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      setStatus('error');
      return;
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setErrorMessage('');
    setStatus('preview');
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!previewUrl || !fileInputRef.current?.files?.[0]) return;
    setIsProcessing(true);
    try {
      const base64 = await imageFileToBase64Png(fileInputRef.current.files[0]);
      onSave(base64);
    } catch {
      setErrorMessage('Gagal memproses gambar. Silakan coba lagi.');
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  }, [previewUrl, onSave]);

  const handleReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setErrorMessage('');
    setStatus('idle');
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [previewUrl]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFile(e.dataTransfer.files?.[0]);
    },
    [handleFile],
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
        aria-hidden="true"
      />

      {status === 'idle' && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload gambar tanda tangan (PNG atau JPG, maks 1MB)"
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-accent bg-accent/5'
              : 'border-slate-300 bg-slate-50 hover:border-accent/50'
          }`}
        >
          <UploadIcon className="mb-3 text-slate-400" />
          <p className="text-sm text-slate-500">
            <span className="font-medium text-accent">Klik untuk upload</span> atau seret gambar ke
            sini
          </p>
          <p className="mt-1 text-xs text-slate-400">PNG atau JPG, maksimal 1MB</p>
        </div>
      )}

      {status === 'preview' && previewUrl && (
        <div className="space-y-3">
          {/* Image preview */}
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview tanda tangan"
              className="mx-auto max-h-32 w-auto object-contain p-3"
            />
          </div>

          {/* Preview hint */}
          <p className="text-center text-xs text-slate-500">Tanda tangan di atas siap digunakan.</p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={isProcessing}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ResetIcon />
              Ganti
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isProcessing}
              className="flex flex-1 items-center justify-center justify-center gap-1.5 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <CheckCircleIcon />
                  Gunakan
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {status === 'error' && errorMessage && (
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            <AlertCircleIcon />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Coba Upload Ulang
          </button>
        </div>
      )}
    </div>
  );
}

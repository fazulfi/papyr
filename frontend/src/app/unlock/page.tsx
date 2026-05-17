'use client';

import { useCallback, useRef, useState } from 'react';
import PasswordInput from '@/components/PasswordInput';
import PrivacyNotice from '@/components/PrivacyNotice';
import OtherTools from '@/components/OtherTools';
import { config } from '@/lib/config';
import { formatFileSize } from '@/lib/format';
import { trackTaskCompleted, trackTaskFailed, trackTaskStarted } from '@/lib/analytics';
import {
  getUnlockErrorMessage,
  getUnlockFailureReason,
  validateUnlockFile,
  validateUnlockPassword,
} from './logic';

function UnlockIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 019.5-2.2" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
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

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
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

type UnlockState = 'idle' | 'file-selected' | 'uploading' | 'processing' | 'done' | 'error';

interface UnlockResult {
  success: boolean;
  download_url: string;
  expires_at: string;
  original_size: number;
  output_size: number;
}

function Shimmer() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
      <div className="h-4 w-1/2 rounded bg-slate-200 animate-pulse" />
      <div className="h-4 w-5/6 rounded bg-slate-200 animate-pulse" />
    </div>
  );
}

function parseErrorDetail(responseText: string): string | undefined {
  try {
    const body = JSON.parse(responseText) as { detail?: string };
    return body.detail;
  } catch {
    return undefined;
  }
}

export default function UnlockPage() {
  const [state, setState] = useState<UnlockState>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UnlockResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [retrying, setRetrying] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const validateFile = useCallback(
    (selectedFile: File): string | null => validateUnlockFile(selectedFile),
    [],
  );

  function handleError(message: string, isRetry: boolean) {
    if (!isRetry) {
      setRetrying(true);
      setState('uploading');
      setTimeout(() => {
        setRetrying(false);
        sendRequest(true);
      }, 1000);
    } else {
      setErrorMessage(message);
      setState('error');
      trackTaskFailed('unlock', 'server_error');
    }
  }

  function sendRequest(isRetry = false) {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as UnlockResult;
          setResult(data);
          setState('done');
          trackTaskCompleted('unlock');
        } catch {
          handleError('Gagal memproses respons server.', isRetry);
        }
      } else if (xhr.status >= 400 && xhr.status < 500) {
        const detail = parseErrorDetail(xhr.responseText);
        const failureReason = getUnlockFailureReason(xhr.status);
        setErrorMessage(getUnlockErrorMessage(xhr.status, detail));
        setState('error');
        trackTaskFailed('unlock', failureReason);
      } else {
        handleError('Gagal memproses file. Silakan coba lagi.', isRetry);
      }
    });

    xhr.addEventListener('error', () => {
      handleError('Gagal memproses file. Silakan coba lagi.', isRetry);
    });

    xhr.addEventListener('timeout', () => {
      handleError('Koneksi timeout. Silakan coba lagi.', isRetry);
    });

    xhr.upload.addEventListener('loadend', () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) {
        setState('processing');
      }
    });

    xhr.open('POST', `${config.apiUrl}/api/unlock`);
    xhr.timeout = 120000;
    xhr.send(formData);

    setState('uploading');
    setProgress(0);
    if (!isRetry) trackTaskStarted('unlock');
  }

  const handleFileSelect = useCallback(
    (selectedFile: File | undefined) => {
      if (!selectedFile) return;
      const error = validateFile(selectedFile);
      if (error) {
        setErrorMessage(error);
        setState('error');
        return;
      }
      setFile(selectedFile);
      setErrorMessage('');
      setState('file-selected');
    },
    [validateFile],
  );

  function handleSubmit() {
    const error = validateUnlockPassword(password);
    if (error) {
      setErrorMessage(error);
      return;
    }
    setErrorMessage('');
    sendRequest();
  }

  const handleReset = useCallback(() => {
    setState('idle');
    setFile(null);
    setPassword('');
    setProgress(0);
    setResult(null);
    setErrorMessage('');
    setRetrying(false);
    setDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(false);
      handleFileSelect(event.dataTransfer.files?.[0]);
    },
    [handleFileSelect],
  );

  const handlePasteClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <UnlockIcon />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-navy md:text-4xl">
          Hapus Password PDF
        </h1>
        <p className="text-base text-slate-500">
          Buka kunci PDF terproteksi dengan password yang benar.
        </p>
        <p className="mt-2 text-sm text-slate-400 max-w-md">
          Upload PDF yang terkunci, masukkan password, lalu unduh file tanpa proteksi. File tersedia
          selama 1 jam.
        </p>
      </div>

      {state === 'idle' && (
        <div
          className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
            dragging ? 'border-accent bg-accent/5' : 'border-slate-200 hover:border-accent/50'
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={handlePasteClick}
          role="button"
          tabIndex={0}
          aria-label="Upload area"
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') handlePasteClick();
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => handleFileSelect(event.target.files?.[0])}
            aria-hidden="true"
          />
          <UploadIcon className="mx-auto mb-4 h-10 w-10 text-slate-400" />
          <p className="text-sm text-slate-500">
            <span className="font-medium text-accent">Klik untuk upload</span> atau seret file PDF
            terenkripsi di sini
          </p>
          <p className="mt-1 text-xs text-slate-400">Maksimal 20MB</p>
        </div>
      )}

      {state === 'file-selected' && file && (
        <div className="animate-fade-up space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-white p-4 border border-slate-100 shadow-sm">
            <FileIcon className="h-8 w-8 text-slate-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy">{file.name}</p>
              <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            PDF terenkripsi terdeteksi ✓
          </div>

          <PasswordInput
            password={password}
            confirmPassword=""
            onPasswordChange={setPassword}
            onConfirmChange={() => undefined}
            showConfirm={false}
            minLength={4}
          />

          {errorMessage && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
              <AlertIcon className="inline mr-2" />
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={retrying}
            className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {retrying ? 'Mencoba lagi...' : 'Hapus Password'}
          </button>
        </div>
      )}

      {state === 'uploading' && (
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

      {state === 'processing' && (
        <div className="animate-fade-up space-y-4 text-center">
          <div className="mx-auto h-10 w-10">
            <Shimmer />
          </div>
          <p className="text-sm text-slate-500">Sedang membuka proteksi file Anda...</p>
        </div>
      )}

      {state === 'done' && result && (
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
                <span className="font-medium text-navy">
                  {formatFileSize(result.original_size)}
                </span>
              </div>
            )}
            {result.output_size && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Ukuran tanpa proteksi</span>
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
            Unduh File Tanpa Password
          </a>
          <button
            onClick={handleReset}
            className="w-full rounded-xl bg-slate-100 py-3 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Unlock File Lain
          </button>
        </div>
      )}

      {state === 'error' && (
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
                setState('file-selected');
                setErrorMessage('');
              }}
              className="flex-1 rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent/90 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      <PrivacyNotice model="server" />
      <OtherTools currentTool="/unlock" />
    </div>
  );
}

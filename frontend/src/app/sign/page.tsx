"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import PrivacyNotice from "@/components/PrivacyNotice";
import OtherTools from "@/components/OtherTools";
import SignaturePad from "@/components/SignaturePad";
import SignatureUpload from "@/components/SignatureUpload";
import SignatureType from "@/components/SignatureType";
import { formatFileSize } from "@/lib/format";
import { trackTaskFailed, trackTaskStarted } from "@/lib/analytics";
import {
  getInitialSignatureState,
  validateSignPdfFile,
  type SignMode,
  type SignState,
  type SignatureState,
} from "./logic";

function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-accent text-white shadow-sm"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function SignatureIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17c3.333-3.333 5-8 9-8s4 5 9 8" />
      <path d="M3 17h18" />
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

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function StepBadge({ active, done, label, number }: { active: boolean; done: boolean; label: string; number: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
          active || done ? "bg-accent text-white" : "bg-slate-100 text-slate-400"
        }`}
      >
        {number}
      </div>
      <span className={`text-sm font-medium ${active ? "text-navy" : done ? "text-slate-600" : "text-slate-400"}`}>
        {label}
      </span>
    </div>
  );
}

function PlacementPlaceholder({ signatureState }: { signatureState: SignatureState }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-navy">Preview PDF</span>
        <span className="text-slate-400">
          Halaman {signatureState.currentPage}/{signatureState.totalPages || 1}
        </span>
      </div>
      <div className="flex aspect-[3/4] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
        <div>
          <p className="text-sm font-medium text-slate-600">Area penempatan tanda tangan</p>
          <p className="mt-1 text-xs text-slate-400">
            Drag-and-drop placement engine akan diimplementasikan pada STEP-F2-025+.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignPage() {
  const [pageState, setPageState] = useState<SignState>("idle");
  const [signatureState, setSignatureState] = useState<SignatureState>(() => getInitialSignatureState());
  const [errorMessage, setErrorMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentStep = useMemo(() => {
    if (pageState === "placing-signature" || pageState === "signing" || pageState === "done") return 2;
    return 1;
  }, [pageState]);

  const handleModeChange = useCallback((mode: SignMode) => {
    setSignatureState((current) => ({ ...current, mode }));
  }, []);

  const handleFileSelect = useCallback((file: File | undefined) => {
    if (!file) return;
    const validationError = validateSignPdfFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      setPageState("error");
      trackTaskFailed("sign", validationError, { error_type: "validation_error" });
      return;
    }

    setSignatureState((current) => ({
      ...current,
      pdfFile: file,
      currentPage: 1,
      totalPages: 1,
      placements: [],
      signatureImage: null,
    }));
    setErrorMessage("");
    setPageState("pdf-selected");
    trackTaskStarted("sign", { step: "create_signature" });
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(false);
      handleFileSelect(event.dataTransfer.files?.[0]);
    },
    [handleFileSelect],
  );

  const handleReset = useCallback(() => {
    setPageState("idle");
    setSignatureState(getInitialSignatureState());
    setErrorMessage("");
    setDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleContinueToPlacement = () => {
    setSignatureState((current) => ({
      ...current,
      signatureImage: current.signatureImage ?? "data:image/png;base64,placeholder",
    }));
    setPageState("placing-signature");
  };

  const handleApplySignature = () => {
    setErrorMessage("Fitur apply dan download akan diaktifkan pada STEP-F2-026. Scaffold STEP-F2-022 hanya menyiapkan layout dan state.");
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <SignatureIcon />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-navy md:text-4xl">
          Tanda Tangani PDF
        </h1>
        <p className="text-base text-slate-500">
          Buat tanda tangan, lalu tempatkan di halaman PDF.
        </p>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          Scaffold client-side: gambar, upload, atau ketik tanda tangan — tanpa upload file ke server.
        </p>
      </div>

      <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
        <StepBadge active={currentStep === 1} done={currentStep > 1} number={1} label="Buat signature" />
        <StepBadge active={currentStep === 2} done={false} number={2} label="Tempatkan di PDF" />
      </div>

      {pageState === "idle" && (
        <div
          className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
            dragging ? "border-accent bg-accent/5" : "border-slate-200 hover:border-accent/50"
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
          aria-label="Upload PDF untuk ditandatangani"
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click();
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
            <span className="font-medium text-accent">Klik untuk upload PDF</span> atau seret file di sini
          </p>
          <p className="mt-1 text-xs text-slate-400">Maksimal 20MB</p>
        </div>
      )}

      {pageState === "pdf-selected" && signatureState.pdfFile && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <FileIcon className="h-8 w-8 shrink-0 text-slate-400" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy">{signatureState.pdfFile.name}</p>
              <p className="text-xs text-slate-400">{formatFileSize(signatureState.pdfFile.size)}</p>
            </div>
            <button type="button" onClick={handleReset} className="text-xs font-medium text-slate-400 hover:text-accent">
              Ganti
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-navy">Pilih mode tanda tangan</p>
            <div className="flex flex-wrap gap-2">
              <TabButton active={signatureState.mode === "draw"} onClick={() => handleModeChange("draw")}>Draw</TabButton>
              <TabButton active={signatureState.mode === "upload"} onClick={() => handleModeChange("upload")}>Upload</TabButton>
              <TabButton active={signatureState.mode === "type"} onClick={() => handleModeChange("type")}>Type</TabButton>
            </div>
            <div className="mt-4">
              {signatureState.mode === "draw" && (
                <SignaturePad
                  onSave={(signatureImage) => {
                    setSignatureState((current) => ({ ...current, signatureImage }));
                  }}
                />
              )}
              {signatureState.mode === "upload" && (
                <SignatureUpload
                  onSave={(signatureImage) => {
                    setSignatureState((current) => ({ ...current, signatureImage }));
                  }}
                />
              )}
              {signatureState.mode === "type" && (
                <SignatureType
                  onSave={(signatureImage) => {
                    setSignatureState((current) => ({ ...current, signatureImage }));
                  }}
                />
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinueToPlacement}
            className="w-full rounded-2xl bg-accent px-6 py-4 text-base font-semibold text-white shadow-md transition-colors hover:bg-accent/90"
          >
            Lanjut Tempatkan Signature
          </button>
        </div>
      )}

      {pageState === "placing-signature" && (
        <div className="space-y-4">
          <PlacementPlaceholder signatureState={signatureState} />
          {errorMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <AlertIcon className="mt-0.5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setErrorMessage("");
                setPageState("pdf-selected");
              }}
              className="rounded-xl bg-slate-100 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleApplySignature}
              className="rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent/90"
            >
              Tanda Tangani PDF
            </button>
          </div>
        </div>
      )}

      {pageState === "error" && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            <AlertIcon className="mt-0.5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent/90"
          >
            Coba Lagi
          </button>
        </div>
      )}

      <PrivacyNotice model="client" />
      <OtherTools currentTool="/sign" />
    </div>
  );
}

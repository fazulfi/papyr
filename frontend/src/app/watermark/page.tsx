"use client";

import { useMemo, useState } from "react";
import type {
  WatermarkImageConfig,
  WatermarkTab,
  WatermarkTextConfig,
} from "./logic";
import {
  isValidWatermarkTab,
  validateWatermarkImageConfig,
  validateWatermarkImageFile,
  validateWatermarkPdfFile,
  validateWatermarkTextConfig,
} from "./logic";
import WatermarkConfig from "@/components/WatermarkConfig";
import PrivacyNotice from "@/components/PrivacyNotice";
import OtherTools from "@/components/OtherTools";
import { formatFileSize } from "@/lib/format";

function WatermarkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h18" />
      <path d="M3 12h18" />
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

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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

export default function WatermarkPage() {
  const [tab, setTab] = useState<WatermarkTab>("text");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState("");
  const [imageError, setImageError] = useState("");
  const [textConfig, setTextConfig] = useState<WatermarkTextConfig>({
    text: "CONFIDENTIAL",
    fontSize: 32,
    opacity: 0.2,
    rotation: -30,
    color: "#CCCCCC",
    position: "diagonal",
  });
  const [imageConfig, setImageConfig] = useState<WatermarkImageConfig>({
    opacity: 0.75,
    position: "bottom-right",
    scale: 0.4,
  });

  const selectedModeLabel = useMemo(() => (tab === "text" ? "Teks" : "Gambar"), [tab]);

  const handlePdfSelect = (file?: File) => {
    if (!file) return;
    const error = validateWatermarkPdfFile(file);
    if (error) {
      setPdfFile(null);
      setPdfError(error);
      return;
    }
    setPdfFile(file);
    setPdfError("");
  };

  const handleImageSelect = (file?: File) => {
    if (!file) return;
    const error = validateWatermarkImageFile(file);
    if (error) {
      setImageFile(null);
      setImageError(error);
      return;
    }
    setImageFile(file);
    setImageError("");
  };

  const validationMessage =
    tab === "text"
      ? validateWatermarkTextConfig(textConfig)
      : validateWatermarkImageConfig(imageConfig);

  const canApply = Boolean(pdfFile) && !validationMessage && (tab === "text" || Boolean(imageFile));

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <WatermarkIcon />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-navy md:text-4xl">
          Tambah Watermark PDF
        </h1>
        <p className="text-base text-slate-500">
          Tambahkan watermark teks atau gambar ke PDF Anda.
        </p>
        <p className="mt-2 text-sm text-slate-400 max-w-md">
          Pilih mode {selectedModeLabel.toLowerCase()} untuk melihat konfigurasi, preview, dan tombol terapkan watermark.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          id="watermark-pdf-input"
          onChange={(event) => handlePdfSelect(event.target.files?.[0])}
        />
        <label
          htmlFor="watermark-pdf-input"
          className="block rounded-2xl border-2 border-dashed border-slate-200 px-6 py-12 text-center transition-colors hover:border-accent/50 cursor-pointer"
        >
          <UploadIcon className="mx-auto mb-4 h-10 w-10 text-slate-400" />
          <p className="text-sm text-slate-500">
            <span className="font-medium text-accent">Klik untuk upload PDF</span> atau seret file di sini
          </p>
          <p className="mt-1 text-xs text-slate-400">Maksimal 20MB</p>
        </label>

        {pdfError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {pdfError}
          </div>
        )}

        {pdfFile && (
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <FileIcon className="h-8 w-8 text-slate-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy">{pdfFile.name}</p>
              <p className="text-xs text-slate-400">{formatFileSize(pdfFile.size)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <TabButton active={tab === "text"} onClick={() => setTab("text")}>Text</TabButton>
        <TabButton active={tab === "image"} onClick={() => setTab("image")}>Image</TabButton>
      </div>

      <div className="mt-4">
        {tab === "text" ? (
          <WatermarkConfig
            tab="text"
            textConfig={textConfig}
            imageConfig={imageConfig}
            onTextConfigChange={setTextConfig}
            onImageConfigChange={setImageConfig}
          />
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                id="watermark-image-input"
                onChange={(event) => handleImageSelect(event.target.files?.[0])}
              />
              <label
                htmlFor="watermark-image-input"
                className="block rounded-2xl border-2 border-dashed border-slate-200 px-6 py-10 text-center transition-colors hover:border-accent/50 cursor-pointer"
              >
                <p className="text-sm text-slate-500">
                  <span className="font-medium text-accent">Klik untuk upload gambar watermark</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">PNG / JPG / WEBP, maksimal 2MB</p>
              </label>
              {imageError && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {imageError}
                </div>
              )}
              {imageFile && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <FileIcon className="h-8 w-8 text-slate-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-navy">{imageFile.name}</p>
                    <p className="text-xs text-slate-400">{formatFileSize(imageFile.size)}</p>
                  </div>
                </div>
              )}
            </div>
            <WatermarkConfig
              tab="image"
              textConfig={textConfig}
              imageConfig={imageConfig}
              onTextConfigChange={setTextConfig}
              onImageConfigChange={setImageConfig}
            />
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">Preview</h2>
        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-400">
          Preview halaman pertama PDF akan muncul di langkah berikutnya.
        </div>
      </div>

      {validationMessage && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          <AlertIcon className="mt-0.5 shrink-0" />
          <p>{validationMessage}</p>
        </div>
      )}

      <button
        type="button"
        disabled={!canApply}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-base font-semibold text-white shadow-md transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Terapkan Watermark
      </button>

      <PrivacyNotice model="hybrid" />
      <OtherTools currentTool="/watermark" />
    </div>
  );
}

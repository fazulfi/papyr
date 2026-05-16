"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  WatermarkImageConfig,
  WatermarkTab,
  WatermarkTextConfig,
} from "@/app/watermark/logic";
import {
  calculateImageOverlayStyle,
  calculatePreviewDimensions,
  calculateTextOverlayStyle,
  createDebouncedRunner,
  getPreviewState,
  hexToRgba,
} from "@/app/watermark/logic";

interface WatermarkPreviewProps {
  pdfFile: File | null;
  tab: WatermarkTab;
  textConfig: WatermarkTextConfig;
  imageConfig: WatermarkImageConfig;
  imageFile: File | null;
}

interface PreviewDimensions {
  width: number;
  height: number;
}

const PREVIEW_DEBOUNCE_MS = 200;

async function renderFirstPdfPage(file: File, canvas: HTMLCanvasElement): Promise<PreviewDimensions> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();

  const pdfBytes = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: pdfBytes }).promise;
  const page = await pdf.getPage(1);
  const originalViewport = page.getViewport({ scale: 1 });
  const dimensions = calculatePreviewDimensions(originalViewport.width, originalViewport.height, 720, 960);
  const viewport = page.getViewport({ scale: dimensions.scale });
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas tidak tersedia di browser ini.");
  }

  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  await page.render({ canvas, canvasContext: context, viewport }).promise;
  pdf.destroy();

  return { width: dimensions.width, height: dimensions.height };
}

function PreviewPlaceholder() {
  return (
    <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-400">
      Upload PDF untuk melihat preview halaman pertama.
    </div>
  );
}

function PreviewLoading() {
  return (
    <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
      <div>
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        Merender halaman pertama PDF...
      </div>
    </div>
  );
}

export default function WatermarkPreview({
  pdfFile,
  tab,
  textConfig,
  imageConfig,
  imageFile,
}: WatermarkPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderVersionRef = useRef(0);
  const debouncerRef = useRef(createDebouncedRunner(PREVIEW_DEBOUNCE_MS));
  const [isRendering, setIsRendering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dimensions, setDimensions] = useState<PreviewDimensions | null>(null);
  const [debouncedTab, setDebouncedTab] = useState(tab);
  const [debouncedTextConfig, setDebouncedTextConfig] = useState(textConfig);
  const [debouncedImageConfig, setDebouncedImageConfig] = useState(imageConfig);

  useEffect(() => {
    const debouncer = debouncerRef.current;
    debouncer.run(() => {
      setDebouncedTab(tab);
      setDebouncedTextConfig(textConfig);
      setDebouncedImageConfig(imageConfig);
    });

    return () => debouncer.cancel();
  }, [tab, textConfig, imageConfig]);

  const imageUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const version = renderVersionRef.current + 1;
    renderVersionRef.current = version;

    if (!pdfFile || !canvas) {
      setDimensions(null);
      setErrorMessage("");
      setIsRendering(false);
      return;
    }

    setIsRendering(true);
    setErrorMessage("");
    setDimensions(null);

    renderFirstPdfPage(pdfFile, canvas)
      .then((nextDimensions) => {
        if (renderVersionRef.current !== version) return;
        setDimensions(nextDimensions);
        setIsRendering(false);
      })
      .catch(() => {
        if (renderVersionRef.current !== version) return;
        setErrorMessage("Preview PDF gagal dibuat. Pastikan file PDF tidak rusak.");
        setIsRendering(false);
      });
  }, [pdfFile]);

  const previewState = getPreviewState({
    hasPdf: Boolean(pdfFile),
    isRendering,
    errorMessage,
  });

  const textOverlay = useMemo(() => {
    if (!dimensions) return null;
    return calculateTextOverlayStyle(
      debouncedTextConfig,
      dimensions.width,
      dimensions.height,
    );
  }, [debouncedTextConfig, dimensions]);

  const imageStyle = useMemo(() => {
    if (!dimensions) return null;
    const position = calculateImageOverlayStyle(
      debouncedImageConfig,
      dimensions.width,
      dimensions.height,
    );
    const size = Math.max(48, Math.round(Math.min(dimensions.width, dimensions.height) * debouncedImageConfig.scale));

    return {
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${size}px`,
      opacity: debouncedImageConfig.opacity,
      transform: "translate(-50%, -50%)",
    };
  }, [debouncedImageConfig, dimensions]);

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">Preview</h2>
        {pdfFile && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            Halaman pertama
          </span>
        )}
      </div>

      {previewState === "placeholder" && <PreviewPlaceholder />}
      {previewState === "loading" && <PreviewLoading />}
      {previewState === "error" && (
        <div className="flex min-h-52 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-600">
          {errorMessage}
        </div>
      )}

      <div
        className={`relative mx-auto overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner ${
          previewState === "ready" ? "block" : "hidden"
        }`}
        style={dimensions ? { maxWidth: "100%", width: dimensions.width } : undefined}
      >
        <canvas ref={canvasRef} className="block h-auto w-full" aria-label="Preview halaman pertama PDF" />
        {dimensions && debouncedTab === "text" && textOverlay && (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          >
            <text
              dominantBaseline="central"
              fill={hexToRgba(debouncedTextConfig.color, debouncedTextConfig.opacity)}
              fontSize={debouncedTextConfig.fontSize}
              fontWeight="700"
              letterSpacing="0.08em"
              textAnchor="middle"
              transform={`rotate(${textOverlay.rotationDegrees} ${textOverlay.x} ${textOverlay.y})`}
              x={textOverlay.x}
              y={textOverlay.y}
            >
              {debouncedTextConfig.text}
            </text>
          </svg>
        )}
        {dimensions && debouncedTab === "image" && imageStyle && imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Preview gambar watermark"
            className="pointer-events-none absolute h-auto object-contain"
            style={imageStyle}
          />
        )}
        {dimensions && debouncedTab === "image" && !imageUrl && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-lg bg-white/90 px-3 py-2 text-center text-xs text-slate-500 shadow-sm">
            Upload gambar watermark untuk melihat overlay.
          </div>
        )}
      </div>
    </div>
  );
}

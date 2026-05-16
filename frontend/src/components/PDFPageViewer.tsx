"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PDFPageViewerProps {
  pdfFile: File | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onTotalPagesChange: (totalPages: number) => void;
  children?: React.ReactNode;
}

const DEFAULT_VIEWER_WIDTH = 720;

function PDFPlaceholder() {
  return (
    <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm text-slate-500">
      Upload PDF untuk melihat halaman penempatan tanda tangan.
    </div>
  );
}

function PDFLoading() {
  return (
    <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm text-slate-500">
      <div>
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        Memuat halaman PDF...
      </div>
    </div>
  );
}

/**
 * Clamps page number to valid range [1, totalPages].
 * When totalPages is 0 or negative, returns 1 (safe default).
 */
export function clampPage(page: number, totalPages: number): number {
  if (totalPages <= 0) return 1;
  return Math.min(Math.max(page, 1), totalPages);
}

export default function PDFPageViewer({
  pdfFile,
  currentPage,
  totalPages,
  onPageChange,
  onTotalPagesChange,
  children,
}: PDFPageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderVersionRef = useRef(0);
  const [isRendering, setIsRendering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [viewerWidth, setViewerWidth] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    onPageChange(clampPage(currentPage - 1, totalPages));
  }, [currentPage, totalPages, onPageChange]);

  const handleNext = useCallback(() => {
    onPageChange(clampPage(currentPage + 1, totalPages));
  }, [currentPage, totalPages, onPageChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const version = renderVersionRef.current + 1;
    renderVersionRef.current = version;

    if (!pdfFile || !canvas) {
      setIsRendering(false);
      setErrorMessage("");
      setViewerWidth(null);
      return;
    }

    setIsRendering(true);
    setErrorMessage("");

    let cancelled = false;

    async function renderPage() {
      if (!pdfFile || !canvas) return;
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.mjs",
          import.meta.url,
        ).toString();

        const pdfBytes = await pdfFile.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: pdfBytes }).promise;

        if (cancelled || renderVersionRef.current !== version) {
          pdf.destroy();
          return;
        }

        const nextTotalPages = pdf.numPages;
        if (nextTotalPages !== totalPages) {
          onTotalPagesChange(nextTotalPages);
        }

        const safePage = clampPage(currentPage, nextTotalPages);
        if (safePage !== currentPage) {
          onPageChange(safePage);
        }

        const page = await pdf.getPage(safePage);
        const originalViewport = page.getViewport({ scale: 1 });
        const fitWidthScale = DEFAULT_VIEWER_WIDTH / originalViewport.width;
        const viewport = page.getViewport({ scale: fitWidthScale });

        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Canvas tidak tersedia di browser ini.");
        }

        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        const renderWidth = Math.round(viewport.width);
        const renderHeight = Math.round(viewport.height);
        canvas.width = Math.round(renderWidth * dpr);
        canvas.height = Math.round(renderHeight * dpr);
        canvas.style.width = `${renderWidth}px`;
        canvas.style.height = `${renderHeight}px`;

        await page.render({
          canvas,
          canvasContext: context,
          viewport,
          transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
        }).promise; 

        if (!cancelled && renderVersionRef.current === version) {
          setViewerWidth(Math.round(viewport.width));
          setIsRendering(false);
        }

        pdf.destroy();
      } catch {
        if (!cancelled && renderVersionRef.current === version) {
          setErrorMessage("Gagal menampilkan halaman PDF. Pastikan file PDF valid.");
          setIsRendering(false);
        }
      }
    }

    void renderPage();

    return () => {
      cancelled = true;
    };
  }, [pdfFile, currentPage, totalPages, onPageChange, onTotalPagesChange]);

  const showPlaceholder = !pdfFile;
  const showError = Boolean(errorMessage);
  const showCanvas = Boolean(pdfFile) && !showError;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-navy">Preview PDF</span>
        <span className="text-slate-400">Halaman {currentPage} dari {totalPages || 1}</span>
      </div>

      {showPlaceholder && <PDFPlaceholder />}
      {showError && (
        <div className="flex min-h-52 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-6 text-center text-sm text-rose-600">
          {errorMessage}
        </div>
      )}

      {showCanvas && (
        <div
          className="relative mx-auto overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner"
          style={viewerWidth ? { maxWidth: "100%", width: viewerWidth } : undefined}
        >
          <canvas ref={canvasRef} className="block h-auto w-full" aria-label={`Preview halaman ${currentPage} PDF`} />
          {children}
          {isRendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
              <PDFLoading />
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!pdfFile || isRendering || currentPage <= 1}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <span className="text-xs font-medium text-slate-500">Halaman {currentPage} dari {totalPages || 1}</span>
        <button
          type="button"
          onClick={handleNext}
          disabled={!pdfFile || isRendering || currentPage >= (totalPages || 1)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}

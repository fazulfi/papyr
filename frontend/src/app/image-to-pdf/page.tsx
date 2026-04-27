"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatFileSize } from "@/lib/format";
import { limits, config } from "@/lib/config";
import { imagesToPDF, downloadPDF } from "@/lib/pdfUtils";

/* ── Types ── */

interface ImageItem {
  id: string;
  file: File;
  preview: string; // object URL for thumbnail
}

type PageState = "idle" | "processing" | "done" | "error";

/* ── Constants ── */

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png"]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
/** Client-side threshold: below this total size, process in browser */
const CLIENT_THRESHOLD_BYTES = 3 * 1024 * 1024; // 3MB

/* ── Inline SVG Icons ── */

function ImageIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
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

function DragIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="5" r="1" /><circle cx="15" cy="5" r="1" />
      <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="19" r="1" /><circle cx="15" cy="19" r="1" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ShieldIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

/* ── Sortable Image Thumbnail ── */

function SortableImageItem({
  item,
  index,
  onRemove,
}: {
  item: ImageItem;
  index: number;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-xl border bg-white transition-shadow ${
        isDragging
          ? "border-accent shadow-lg"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        <img
          src={item.preview}
          alt={item.file.name}
          className="h-full w-full object-cover"
        />

        {/* Order badge */}
        <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md bg-accent text-xs font-bold text-white shadow-sm">
          {index + 1}
        </span>

        {/* Remove button */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
          aria-label={`Hapus ${item.file.name}`}
        >
          <XIcon />
        </button>

        {/* Drag handle */}
        <button
          type="button"
          className="absolute bottom-2 right-2 flex h-7 w-7 cursor-grab items-center justify-center rounded-lg bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <DragIcon />
        </button>
      </div>

      {/* File info */}
      <div className="px-2.5 py-2">
        <p className="truncate text-xs font-medium text-navy">{item.file.name}</p>
        <p className="text-[11px] text-slate-400">{formatFileSize(item.file.size)}</p>
      </div>
    </div>
  );
}

/* ── Feature Badges ── */

const FEATURES = [
  { icon: <ZapIcon />, text: "Proses instan" },
  { icon: <LockIcon />, text: "Tanpa upload server" },
  { icon: <ShieldIcon />, text: "Privasi terjaga" },
] as const;

/* ── Page ── */

let nextId = 0;
function generateId(): string {
  nextId += 1;
  return `img-${nextId}-${Date.now()}`;
}

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toLowerCase() : "";
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageState, setPageState] = useState<PageState>("idle");
  const [resultData, setResultData] = useState<Uint8Array | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [imageCount, setImageCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const imageIds = useMemo(() => images.map((i) => i.id), [images]);

  const totalSize = useMemo(
    () => images.reduce((sum, i) => sum + i.file.size, 0),
    [images],
  );

  /* ── Image Management ── */

  const addImages = useCallback((newFiles: FileList | File[]) => {
    const toAdd: ImageItem[] = [];
    const errors: string[] = [];

    for (const file of Array.from(newFiles)) {
      if (!ALLOWED_TYPES.has(file.type)) {
        const ext = getExtension(file.name);
        if (!ALLOWED_EXTENSIONS.has(ext)) {
          errors.push(`"${file.name}" bukan format yang didukung. Hanya JPG dan PNG.`);
          continue;
        }
      }
      if (file.size > limits.maxUploadBytes) {
        errors.push(`"${file.name}" terlalu besar (maks ${limits.maxUploadMB}MB).`);
        continue;
      }
      if (file.size === 0) {
        errors.push(`"${file.name}" kosong.`);
        continue;
      }
      toAdd.push({
        id: generateId(),
        file,
        preview: URL.createObjectURL(file),
      });
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(" "));
      setPageState("error");
    }

    if (toAdd.length > 0) {
      setImages((prev) => [...prev, ...toAdd]);
      if (errors.length === 0) {
        setPageState("idle");
        setErrorMessage("");
      }
    }
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length > 0) {
        addImages(e.dataTransfer.files);
      }
    },
    [addImages],
  );

  /* ── Convert ── */

  const handleConvert = useCallback(async () => {
    if (images.length === 0) return;

    setPageState("processing");
    setErrorMessage("");

    const files = images.map((i) => i.file);

    try {
      if (totalSize <= CLIENT_THRESHOLD_BYTES) {
        // Client-side conversion
        const result = await imagesToPDF(files);
        setResultData(result);
        setResultUrl(null);
        setImageCount(images.length);
        setPageState("done");
      } else {
        // Backend fallback for large files
        const formData = new FormData();
        for (const file of files) {
          formData.append("files", file);
        }

        const response = await fetch(`${config.apiUrl}/api/image-to-pdf`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          const detail = body?.detail ?? `Server error (${response.status})`;
          throw new Error(detail);
        }

        const data = await response.json();
        setResultUrl(data.download_url);
        setResultData(null);
        setImageCount(images.length);
        setPageState("done");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Gagal membuat PDF. Silakan coba lagi.",
      );
      setPageState("error");
    }
  }, [images, totalSize]);

  const handleDownload = useCallback(() => {
    if (resultData) {
      downloadPDF(resultData, "images.pdf");
    } else if (resultUrl) {
      window.open(resultUrl, "_blank");
    }
  }, [resultData, resultUrl]);

  const resetAll = useCallback(() => {
    // Revoke all preview URLs
    for (const img of images) {
      URL.revokeObjectURL(img.preview);
    }
    setImages([]);
    setPageState("idle");
    setResultData(null);
    setResultUrl(null);
    setImageCount(0);
    setErrorMessage("");
    setDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [images]);

  /* ── Render ── */

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      {/* Tool header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <ImageIcon />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-navy md:text-4xl">
          Gambar ke PDF
        </h1>
        <p className="text-base text-slate-500">
          Ubah foto atau gambar menjadi file PDF.
        </p>
      </div>

      {/* Done state */}
      {pageState === "done" && (
        <div className="animate-fade-up rounded-2xl border border-accent/20 bg-white p-6 shadow-[0_4px_20px_rgba(37,99,235,0.06)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <CheckIcon />
            </div>
            <div>
              <p className="text-base font-semibold text-navy">
                PDF berhasil dibuat!
              </p>
              <p className="text-xs text-slate-500">
                {imageCount} gambar
                {resultData ? ` · ${formatFileSize(resultData.length)}` : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="mb-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-4 text-base font-semibold text-white shadow-[0_2px_12px_rgba(37,99,235,0.25)] transition-colors hover:bg-accent/90"
          >
            <DownloadIcon />
            Unduh PDF
          </button>

          <button
            type="button"
            onClick={resetAll}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-transparent px-5 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
          >
            <RefreshIcon />
            Buat PDF lain
          </button>
        </div>
      )}

      {/* Processing state */}
      {pageState === "processing" && (
        <div className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-6">
          <p className="mb-2.5 text-sm font-medium text-slate-500">
            Membuat PDF dari {images.length} gambar...
          </p>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="absolute inset-0 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-accent to-transparent bg-[length:200%_100%]" />
          </div>
          <p className="mt-2.5 text-center text-xs text-slate-400">
            {totalSize <= CLIENT_THRESHOLD_BYTES
              ? "Proses berjalan di browser — file tidak dikirim ke server."
              : "Mengirim ke server untuk diproses..."}
          </p>
        </div>
      )}

      {/* Error state */}
      {pageState === "error" && (
        <div className="animate-fade-up mb-4 rounded-2xl border border-rose-200 bg-rose-50/50 p-6">
          <div className="mb-4 flex items-center gap-3 text-rose-500">
            <AlertIcon />
            <p className="text-sm font-semibold">Terjadi Kesalahan</p>
          </div>
          <p className="mb-5 text-sm text-slate-600">{errorMessage}</p>
          <button
            type="button"
            onClick={() => {
              setPageState("idle");
              setErrorMessage("");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Upload + image grid (visible in idle and error states) */}
      {(pageState === "idle" || pageState === "error") && (
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
              accept="image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  addImages(e.target.files);
                  e.target.value = "";
                }
              }}
            />
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <UploadIcon />
            </div>
            <p className="mb-2 text-base font-semibold tracking-tight text-navy">
              {images.length === 0
                ? "Seret gambar ke sini\natau klik untuk memilih"
                : "Tambah gambar lagi"}
            </p>
            <p className="text-xs text-slate-400">
              Maks {limits.maxUploadMB}MB per file · JPG, PNG
            </p>
          </div>

          {/* Image grid */}
          {images.length > 0 && (
            <div className="mt-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {images.length} gambar dipilih · {formatFileSize(totalSize)}
                </p>
                {images.length >= 2 && (
                  <p className="text-xs text-slate-400">Seret untuk mengubah urutan</p>
                )}
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={imageIds} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((item, index) => (
                      <SortableImageItem
                        key={item.id}
                        item={item}
                        index={index}
                        onRemove={removeImage}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Convert button */}
              <button
                type="button"
                onClick={handleConvert}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-4 text-base font-semibold text-white shadow-[0_2px_12px_rgba(37,99,235,0.25)] transition-colors hover:bg-accent/90"
              >
                Buat PDF
              </button>
            </div>
          )}

          {/* Empty state */}
          {images.length === 0 && (
            <p className="mt-4 text-center text-sm text-slate-400">
              Belum ada gambar. Pilih minimal 1 gambar.
            </p>
          )}

          {/* Feature badges + privacy notice */}
          {images.length === 0 && (
            <>
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                {FEATURES.map((f) => (
                  <div
                    key={f.text}
                    className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm"
                  >
                    <div className="mb-3 text-accent">{f.icon}</div>
                    <h3 className="text-sm font-semibold text-navy">{f.text}</h3>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-start justify-center rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                <span className="mr-2 mt-0.5 shrink-0 text-slate-400">
                  <ShieldIcon size={16} />
                </span>
                <p>
                  Gambar kecil diproses langsung di browser. File besar dikirim ke server
                  dan otomatis dihapus dalam 1 jam.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatFileSize } from '@/lib/format';
import { limits } from '@/lib/config';
import { mergePDFs, downloadPDF } from '@/lib/pdfUtils';
import { trackTaskStarted, trackTaskCompleted, trackTaskFailed } from '@/lib/analytics';
import OtherTools from '@/components/OtherTools';
import PrivacyNotice from '@/components/PrivacyNotice';

/* ── Types ── */

interface FileItem {
  id: string;
  file: File;
}

type MergeState = 'idle' | 'processing' | 'done' | 'error';

/* ── Inline SVG Icons ── */

function MergeIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6H21" />
      <path d="M8 12H21" />
      <path d="M8 18H21" />
      <path d="M3 6H3.01" />
      <path d="M3 12H3.01" />
      <path d="M3 18H3.01" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      width="26"
      height="26"
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

function FileIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function DragIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="5" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  );
}

function XIcon() {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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

function DownloadIcon() {
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
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function RefreshIcon() {
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
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
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

function ShieldIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

/* ── Sortable File Item ── */

function SortableFileItem({
  item,
  index,
  onRemove,
}: {
  item: FileItem;
  index: number;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border bg-white px-3 py-3 transition-shadow ${
        isDragging ? 'border-accent shadow-lg' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="cursor-grab touch-none text-slate-300 hover:text-slate-500 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <DragIcon />
      </button>

      {/* Order number */}
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/10 text-xs font-bold text-accent">
        {index + 1}
      </span>

      {/* File icon */}
      <div className="shrink-0 text-slate-400">
        <FileIcon />
      </div>

      {/* File info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-navy">{item.file.name}</p>
        <p className="text-xs text-slate-400">{formatFileSize(item.file.size)}</p>
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="shrink-0 rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
        aria-label={`Hapus ${item.file.name}`}
      >
        <XIcon />
      </button>
    </div>
  );
}

/* ── Feature Badges ── */

const FEATURES = [
  { icon: <ZapIcon />, text: 'Proses di browser' },
  { icon: <LockIcon />, text: 'Tanpa upload server' },
  { icon: <ShieldIcon />, text: 'Privasi terjaga' },
] as const;

/* ── Page ── */

let nextId = 0;
function generateId(): string {
  nextId += 1;
  return `file-${nextId}-${Date.now()}`;
}

export default function MergePage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [mergeState, setMergeState] = useState<MergeState>('idle');
  const [mergedData, setMergedData] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const fileIds = useMemo(() => files.map((f) => f.id), [files]);

  const totalSize = useMemo(() => files.reduce((sum, f) => sum + f.file.size, 0), [files]);

  /* ── File Management ── */

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const toAdd: FileItem[] = [];
    const errors: string[] = [];

    for (const file of Array.from(newFiles)) {
      if (file.type !== 'application/pdf') {
        errors.push(`"${file.name}" bukan file PDF.`);
        continue;
      }
      if (file.size > limits.maxUploadBytes) {
        errors.push(`"${file.name}" terlalu besar (maks ${limits.maxUploadMB}MB).`);
        continue;
      }
      if (file.size === 0) {
        errors.push(`"${file.name}" kosong.`);
        continue;
      }
      toAdd.push({ id: generateId(), file });
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(' '));
      setMergeState('error');
    }

    if (toAdd.length > 0) {
      setFiles((prev) => [...prev, ...toAdd]);
      if (errors.length === 0) {
        setMergeState('idle');
        setErrorMessage('');
      }
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles((prev) => {
        const oldIndex = prev.findIndex((f) => f.id === active.id);
        const newIndex = prev.findIndex((f) => f.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles],
  );

  /* ── Merge ── */

  const handleMerge = useCallback(async () => {
    if (files.length < 2) return;

    setMergeState('processing');
    setErrorMessage('');
    trackTaskStarted('merge');

    try {
      const result = await mergePDFs(files.map((f) => f.file));
      setMergedData(result);
      setMergeState('done');
      trackTaskCompleted('merge');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Gagal menggabungkan PDF. Silakan coba lagi.';
      setErrorMessage(msg);
      setMergeState('error');
      trackTaskFailed('merge', 'server_error');
    }
  }, [files]);

  const handleDownload = useCallback(() => {
    if (mergedData) {
      downloadPDF(mergedData, 'merged.pdf');
    }
  }, [mergedData]);

  const resetAll = useCallback(() => {
    setFiles([]);
    setMergeState('idle');
    setMergedData(null);
    setErrorMessage('');
    setDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  /* ── Render ── */

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      {/* Tool header */}
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <MergeIcon />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-navy md:text-4xl">
          Gabungkan PDF
        </h1>
        <p className="text-base text-slate-500">Gabungkan beberapa file PDF menjadi satu.</p>
        <p className="mt-2 text-sm text-slate-400 max-w-md">
          Satukan scan KTP, ijazah, dan dokumen lainnya jadi satu file untuk keperluan lamaran kerja
          atau pendaftaran online.
        </p>
      </div>

      {/* Done state */}
      {mergeState === 'done' && mergedData && (
        <div className="animate-fade-up rounded-2xl border border-accent/20 bg-white p-6 shadow-[0_4px_20px_rgba(37,99,235,0.06)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <CheckIcon />
            </div>
            <div>
              <p className="text-base font-semibold text-navy">PDF berhasil digabungkan!</p>
              <p className="text-xs text-slate-500">
                {files.length} file · {formatFileSize(mergedData.length)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="mb-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-4 text-base font-semibold text-white shadow-[0_2px_12px_rgba(37,99,235,0.25)] transition-colors hover:bg-accent/90"
          >
            <DownloadIcon />
            Unduh PDF Gabungan
          </button>

          <button
            type="button"
            onClick={resetAll}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-transparent px-5 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
          >
            <RefreshIcon />
            Gabungkan file lain
          </button>
        </div>
      )}

      {/* Processing state */}
      {mergeState === 'processing' && (
        <div className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-6">
          <p className="mb-2.5 text-sm font-medium text-slate-500">
            Sedang menggabungkan {files.length} file...
          </p>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="absolute inset-0 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-accent to-transparent bg-[length:200%_100%]" />
          </div>
          <p className="mt-2.5 text-center text-xs text-slate-400">
            Proses berjalan di browser — file tidak dikirim ke server.
          </p>
        </div>
      )}

      {/* Error state */}
      {mergeState === 'error' && (
        <div className="animate-fade-up mb-4 rounded-2xl border border-rose-200 bg-rose-50/50 p-6">
          <div className="mb-4 flex items-center gap-3 text-rose-500">
            <AlertIcon />
            <p className="text-sm font-semibold">Terjadi Kesalahan</p>
          </div>
          <p className="mb-5 text-sm text-slate-600">{errorMessage}</p>
          <button
            type="button"
            onClick={() => {
              setMergeState('idle');
              setErrorMessage('');
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Upload + file list (visible in idle and error states) */}
      {(mergeState === 'idle' || mergeState === 'error') && (
        <div className="animate-fade-up">
          {/* Upload zone */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-2xl border-2 border-dashed bg-white px-5 py-14 text-center transition-all ${
              dragging ? 'border-accent bg-accent/5' : 'border-slate-300 hover:border-accent/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  addFiles(e.target.files);
                  e.target.value = '';
                }
              }}
            />
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <UploadIcon />
            </div>
            <p className="mb-2 text-base font-semibold tracking-tight text-navy">
              {files.length === 0
                ? 'Seret beberapa PDF ke sini\natau klik untuk memilih'
                : 'Tambah file lagi'}
            </p>
            <p className="text-xs text-slate-400">
              Maks {limits.maxUploadMB}MB per file · Hanya file PDF
            </p>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="mt-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {files.length} file dipilih · {formatFileSize(totalSize)}
                </p>
                {files.length >= 2 && (
                  <p className="text-xs text-slate-400">Seret untuk mengubah urutan</p>
                )}
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={fileIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {files.map((item, index) => (
                      <SortableFileItem
                        key={item.id}
                        item={item}
                        index={index}
                        onRemove={removeFile}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Merge button */}
              <button
                type="button"
                onClick={handleMerge}
                disabled={files.length < 2}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-semibold transition-colors ${
                  files.length >= 2
                    ? 'bg-accent text-white shadow-[0_2px_12px_rgba(37,99,235,0.25)] hover:bg-accent/90'
                    : 'cursor-not-allowed bg-slate-200 text-slate-400'
                }`}
              >
                Gabungkan PDF
              </button>

              {files.length < 2 && (
                <p className="mt-2 text-center text-xs text-slate-400">
                  Upload minimal 2 file PDF untuk menggabungkan.
                </p>
              )}
            </div>
          )}

          {/* Empty state */}
          {files.length === 0 && (
            <p className="mt-4 text-center text-sm text-slate-400">
              Belum ada file. Upload minimal 2 PDF.
            </p>
          )}

          {/* Feature badges */}
          {files.length === 0 && (
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.text}
                  className="flex flex-col items-center rounded-2xl bg-white p-5 text-center border border-slate-100 shadow-sm"
                >
                  <div className="text-accent mb-3">{f.icon}</div>
                  <h3 className="text-sm font-semibold text-navy">{f.text}</h3>
                </div>
              ))}
            </div>
          )}

          {/* Other tools */}
          <OtherTools currentTool="/merge" />
        </div>
      )}

      {/* Privacy notice — always visible */}
      <PrivacyNotice model="client" />
    </div>
  );
}

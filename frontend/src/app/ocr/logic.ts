/**
 * OCR Page Logic — Extracted from page.tsx for testability
 *
 * Mirrors the inline helpers in frontend/src/app/ocr/page.tsx exactly.
 */

export type OcrLanguage = "ind" | "eng" | "ind+eng";

export const LANGUAGE_OPTIONS: OcrLanguage[] = ["ind", "eng", "ind+eng"];

/**
 * Returns display label for a language code.
 */
export function getLanguageLabel(lang: OcrLanguage): string {
  switch (lang) {
    case "ind":
      return "Bahasa Indonesia";
    case "eng":
      return "English";
    case "ind+eng":
      return "Indonesia + English";
  }
}

interface Limits {
  allowedPdfMimeTypes: readonly string[];
  maxUploadBytes: number;
  maxUploadMB: number;
}

type FileLike = Pick<File, "type" | "size" | "name">;

/**
 * Validates file for OCR upload — PDF only, max 20MB, non-empty.
 * Mirrors getFileValidationError() in page.tsx.
 */
export function getFileValidationError(
  file: FileLike,
  limits?: Limits,
): string | null {
  const maxBytes = limits?.maxUploadBytes ?? 20 * 1024 * 1024;
  const allowedPdfMimeTypes = limits?.allowedPdfMimeTypes ?? ["application/pdf"];

  const isPdfMime = allowedPdfMimeTypes.includes(
    file.type as (typeof allowedPdfMimeTypes)[number],
  );
  const hasPdfExtension = /\.pdf$/i.test(file.name);

  if (!isPdfMime && !hasPdfExtension) {
    return `"${file.name}" bukan file PDF.`;
  }

  if (file.size > maxBytes) {
    return `"${file.name}" terlalu besar (maks ${limits?.maxUploadMB ?? 20}MB).`;
  }

  if (file.size === 0) {
    return `"${file.name}" kosong.`;
  }

  return null;
}

/* ── Async task state types (mirrors useAsyncTask) ── */

export type AsyncTaskStatus =
  | "idle"
  | "submitting"
  | "queued"
  | "processing"
  | "done"
  | "failed"
  | "timeout";

export interface AsyncTaskState {
  taskId: string | null;
  status: AsyncTaskStatus;
  progress: number | null;
  result: Record<string, unknown> | null;
  error: string | null;
}

export const IDLE_STATE: AsyncTaskState = {
  taskId: null,
  status: "idle",
  progress: null,
  result: null,
  error: null,
};

export interface OcrResult {
  download_url: string;
  original_size?: number;
  output_size?: number;
  expires_at?: string;
  pages_processed?: number;
  language_used?: string;
}

/* ── Progress / UI helpers ── */

export function computeProgressValue(
  status: AsyncTaskStatus,
  progress: number | null,
): number {
  if (typeof progress === "number") return Math.max(0, Math.min(100, progress));
  if (status === "queued") return 15;
  if (status === "processing") return 65;
  if (status === "done") return 100;
  return 0;
}

export function isTerminalOcrStatus(status: string): boolean {
  return status === "done" || status === "failed" || status === "timeout";
}

/* ── Analytics event names (match page.tsx TOOL_NAME) ── */

export const OCR_TOOL_NAME = "ocr" as const;
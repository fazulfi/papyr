/**
 * STEP-F2-022: Sign PDF scaffold logic
 * Provides validation, state types, and helpers for the /sign page.
 *
 * Two-step flow:
 *  1. Create signature (draw / upload / type) on uploaded PDF.
 *  2. Place signature on PDF pages (drag-and-drop placement).
 *
 * Deep behavior (canvas drawing, placement engine, pdf-lib pipeline)
 * is implemented in subsequent steps (F2-023+). This module only
 * exposes scaffolding types and pure validation helpers.
 */

/* ── Mode + Step Types ── */

export type SignMode = "draw" | "upload" | "type";

/**
 * High-level page state for the /sign route.
 * - idle              : no PDF uploaded yet
 * - pdf-selected      : PDF uploaded, user is creating signature (Step 1)
 * - placing-signature : signature created, user is placing it on pages (Step 2)
 * - signing           : pdf-lib pipeline is applying placements
 * - done              : output ready for download
 * - error             : a recoverable error occurred
 */
export type SignState =
  | "idle"
  | "pdf-selected"
  | "placing-signature"
  | "signing"
  | "done"
  | "error";

/* ── Required STEP-F2-022 State Interfaces (exact shape) ── */

export interface SignaturePlacement {
  id: string;
  page: number; // 1-indexed
  x: number; // 0-1 relative to page width
  y: number; // 0-1 relative to page height
  width: number; // 0-1 relative to page width
  height: number; // 0-1 relative to page height
}

export interface SignatureState {
  mode: SignMode;
  signatureImage: string | null; // base64 PNG
  placements: SignaturePlacement[];
  currentPage: number;
  totalPages: number;
  pdfFile: File | null;
}

/* ── Constants ── */

export const MAX_SIGN_PDF_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

/* ── Validation Helpers ── */

/**
 * Validates that the uploaded file is a valid PDF candidate for signing.
 * Returns an error message in Bahasa Indonesia, or null if the file is OK.
 */
export function validateSignPdfFile(
  file: Pick<File, "type" | "size">,
): string | null {
  if (!file.type || file.type !== "application/pdf") {
    return "Tipe file tidak valid. Hanya file PDF yang diterima.";
  }

  if (file.size === 0) {
    return "File kosong. Silakan upload file PDF yang valid.";
  }

  if (file.size > MAX_SIGN_PDF_SIZE_BYTES) {
    return "Ukuran file terlalu besar. Maksimal 20MB.";
  }

  return null;
}

/**
 * Type guard for valid SignMode values.
 */
export function isValidSignMode(value: string): value is SignMode {
  return value === "draw" || value === "upload" || value === "type";
}

/* ── State Helpers ── */

/**
 * Returns the initial signature state for a fresh session.
 */
export function getInitialSignatureState(): SignatureState {
  return {
    mode: "draw",
    signatureImage: null,
    placements: [],
    currentPage: 1,
    totalPages: 0,
    pdfFile: null,
  };
}

/**
 * Returns the display label for a sign mode (Bahasa Indonesia).
 */
export function getSignModeLabel(mode: SignMode): string {
  switch (mode) {
    case "draw":
      return "Gambar";
    case "upload":
      return "Upload";
    case "type":
      return "Ketik";
  }
}

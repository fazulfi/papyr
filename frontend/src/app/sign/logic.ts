/**
 * STEP-F2-022: Sign PDF scaffold logic
 * Provides validation, state types, and helpers for the /sign page.
 *
 * Two-step flow:
 *  1. Create signature (draw / upload / type) on uploaded PDF.
 *  2. Place signature on PDF pages (drag-and-drop placement).
 *
 * Canvas drawing logic (STEP-F2-023) exports pure helpers here
 * so tests can verify state transitions and data transformations
 * without a live canvas DOM element.
 */

/* ── Mode + Step Types ── */

export type SignMode = "draw" | "upload" | "type";

/* ── STEP-F2-023 SignaturePad Draw Types ── */

/** A single (x,y) point in the stroke path. */
export interface DrawPoint {
  x: number;
  y: number;
}

/** A complete stroke: sequence of points + rendering params. */
export interface Stroke {
  points: DrawPoint[];
  color: string;   // hex e.g. "#000000" or "#1E40AF"
  width: number;   // pixels e.g. 2, 4, or 6
}

/** Supported line-width labels (used in the UI selector). */
export type LineWidth = "thin" | "medium" | "thick";

/* ── STEP-F2-023 Constants ── */

export const LINE_WIDTH_MAP: Record<LineWidth, number> = {
  thin: 2,
  medium: 4,
  thick: 6,
} as const;

export const LINE_WIDTH_LABELS: LineWidth[] = ["thin", "medium", "thick"];

export const SIGNATURE_COLORS = ["#000000", "#1E40AF"] as const;

export type SignatureColor = (typeof SIGNATURE_COLORS)[number];

/** Default canvas dimensions for the draw pad. */
export const CANVAS_WIDTH = 560;
export const CANVAS_HEIGHT = 200;

/* ── STEP-F2-023 Type Guards ── */

export function isValidLineWidth(value: string): value is LineWidth {
  return value === "thin" || value === "medium" || value === "thick";
}

export function isValidSignatureColor(value: string): value is SignatureColor {
  return (SIGNATURE_COLORS as readonly string[]).includes(value);
}

export function isValidLineWidthIndex(value: number): value is 0 | 1 | 2 {
  return value === 0 || value === 1 || value === 2;
}

/* ── STEP-F2-023 Pure Helpers ── */

/**
 * Return the numeric pixel width for a LineWidth label.
 */
export function getLineWidthPixels(label: LineWidth): number {
  return LINE_WIDTH_MAP[label];
}

/**
 * Produce the data-URL string that canvas.toDataURL("image/png")
 * would return, for a transparent PNG export contract check.
 * Used to verify the export pathway shape without a real canvas.
 */
export function createSignaturePngDataUrl(pixelData: string): string {
  return `data:image/png;base64,${pixelData}`;
}

/**
 * Extracts just the base64 payload from a PNG data URL.
 * Returns null if the format is unexpected.
 */
export function extractPngBase64(dataUrl: string): string | null {
  const prefix = "data:image/png;base64,";
  if (!dataUrl.startsWith(prefix)) return null;
  return dataUrl.slice(prefix.length);
}

/**
 * Remove the last stroke from a strokes array (undo operation).
 * Returns the new array (immutable).
 */
export function removeLastStroke(strokes: Stroke[]): Stroke[] {
  if (strokes.length === 0) return strokes;
  return strokes.slice(0, -1);
}

/**
 * Return the total number of points across all strokes.
 * Useful for determining if the pad has "real" content.
 */
export function getTotalPoints(strokes: Stroke[]): number {
  let count = 0;
  for (const s of strokes) {
    count += s.points.length;
  }
  return count;
}

/**
 * Returns true if the strokes array contains meaningful drawing data
 * (at least one stroke with at least two points — i.e. a drawn line).
 */
export function hasMeaningfulStroke(strokes: Stroke[]): boolean {
  return strokes.some((s) => s.points.length >= 2);
}

/**
 * Build a Stroke object from the current drawing params.
 */
export function createStroke(
  points: DrawPoint[],
  color: string,
  width: number,
): Stroke {
  return { points, color, width };
}

/**
 * Compute a "pixel bounding-box" of all strokes so the export
 * can optionally crop whitespace. Returns { minX, minY, maxX, maxY }.
 * When no points exist, returns the full canvas dimensions.
 */
export function getStrokesBounds(
  strokes: Stroke[],
  fallbackWidth = CANVAS_WIDTH,
  fallbackHeight = CANVAS_HEIGHT,
): { minX: number; minY: number; maxX: number; maxY: number } {
  if (strokes.length === 0) {
    return { minX: 0, minY: 0, maxX: fallbackWidth, maxY: fallbackHeight };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const s of strokes) {
    for (const p of s.points) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
  }

  // No points case
  if (!isFinite(minX)) {
    return { minX: 0, minY: 0, maxX: fallbackWidth, maxY: fallbackHeight };
  }

  return { minX, minY, maxX, maxY };
}

/**
 * Returns the recommended canvas dimensions based on the parent width.
 * Used to size the canvas responsively while keeping min/max constraints.
 */
export function getCanvasDimensions(
  parentWidth: number,
): { width: number; height: number } {
  const clamped = Math.min(Math.max(parentWidth, 280), CANVAS_WIDTH);
  const ratio = CANVAS_HEIGHT / CANVAS_WIDTH;
  return { width: Math.round(clamped), height: Math.round(clamped * ratio) };
}

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

/* ── STEP-F2-024 Upload Mode ── */

export const MAX_SIGNATURE_IMAGE_SIZE_BYTES = 1024 * 1024; // 1MB

export const ALLOWED_SIGNATURE_IMAGE_TYPES = ["image/png", "image/jpeg"] as const;

export type AllowedSignatureImageType = (typeof ALLOWED_SIGNATURE_IMAGE_TYPES)[number];

/**
 * Validates a signature image file (PNG/JPG, max 1MB).
 * Returns an error message string, or null if valid.
 */
export function validateSignatureImageFile(
  file: Pick<File, "type" | "size">,
): string | null {
  if (!file.type || !(ALLOWED_SIGNATURE_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Tipe file tidak valid. Hanya file PNG dan JPG yang diterima.";
  }
  if (file.size === 0) {
    return "File kosong. Silakan upload file yang valid.";
  }
  if (file.size > MAX_SIGNATURE_IMAGE_SIZE_BYTES) {
    return "Ukuran file terlalu besar. Maksimal 1MB.";
  }
  return null;
}

/**
 * Loads an image File into an HTMLImageElement.
 * Returns a promise resolved with the load event.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gagal memuat gambar."));
    };
    img.src = url;
  });
}

/**
 * Converts an uploaded image file to a base64 PNG data URL.
 * Maintains aspect ratio, fit within 560×200 max.
 */
export async function imageFileToBase64Png(file: File): Promise<string> {
  const img = await loadImage(file);
  const MAX_W = 560;
  const MAX_H = 200;
  let { width, height } = img;
  if (width > MAX_W) {
    height = Math.round((height * MAX_W) / width);
    width = MAX_W;
  }
  if (height > MAX_H) {
    width = Math.round((width * MAX_H) / height);
    height = MAX_H;
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia.");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/png");
}

/* ── STEP-F2-024 Type Mode Constants ── */

export interface SignatureFont {
  /** Full CSS font-family value (including fallbacks). */
  family: string;
  /** Human-readable label shown in UI. */
  label: string;
  /** Google Fonts URL-safe family name (spaces → +). */
  googleFontName: string;
}

export const SIGNATURE_FONTS: SignatureFont[] = [
  { family: "'Dancing Script', cursive", label: "Dancing Script", googleFontName: "Dancing+Script" },
  { family: "'Caveat', cursive", label: "Caveat", googleFontName: "Caveat" },
  { family: "'Satisfy', cursive", label: "Satisfy", googleFontName: "Satisfy" },
  { family: "'Pacifico', cursive", label: "Pacifico", googleFontName: "Pacifico" },
];

export const DEFAULT_SIGNATURE_FONT: SignatureFont = SIGNATURE_FONTS[0];

/**
 * Renders text to an off-screen canvas and returns a base64 PNG data URL.
 * The font is expected to be already loaded via injected Google Fonts link.
 */
export async function renderSignatureText(
  text: string,
  fontFamily: string,
  color: string,
): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia.");

  const fontSize = 48;
  const padding = 20;

  ctx.font = `${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize * 1.2;

  const width = Math.ceil(textWidth + padding * 2);
  const height = Math.ceil(textHeight + padding * 2);

  canvas.width = width;
  canvas.height = height;

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(text, width / 2, height / 2);

  return canvas.toDataURL("image/png");
}

/**
 * Generates the Google Fonts <link> href for all signature fonts.
 * Use this to inject into the document <head> before rendering type-mode signatures.
 */
export function getGoogleFontsLink(): string {
  const families = SIGNATURE_FONTS.map((f) => f.googleFontName).join("&family=");
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
}

/**
 * Injects the Google Fonts stylesheet into the document <head>.
 * Safe to call multiple times — checks for existing link before adding.
 */
export function injectSignatureFonts(): void {
  if (typeof document === "undefined") return;
  const linkId = "signature-fonts-link";
  if (document.getElementById(linkId)) return;
  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = getGoogleFontsLink();
  document.head.appendChild(link);
}

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

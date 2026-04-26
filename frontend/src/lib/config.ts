/**
 * Typed configuration constants from environment variables.
 *
 * All NEXT_PUBLIC_* vars are available at build time.
 * Non-public vars are only available server-side.
 */

export const config = {
  /** Base URL for the FastAPI backend */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",

  /** Plausible Analytics domain (kosong = analytics nonaktif) */
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",

  /** Public site URL */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** Supabase — standby, belum aktif di MVP 0.1 */
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
} as const;

/** Upload constraints (mirrored from backend) */
export const limits = {
  /** Maximum upload size in bytes (20MB) */
  maxUploadBytes: 20 * 1024 * 1024,

  /** Maximum upload size in MB */
  maxUploadMB: 20,

  /** File retention in minutes before auto-delete */
  fileRetentionMinutes: 60,

  /** Allowed MIME types for PDF upload */
  allowedPdfMimeTypes: ["application/pdf"] as const,

  /** Allowed MIME types for image upload */
  allowedImageMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ] as const,
} as const;

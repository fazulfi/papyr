export type WatermarkTab = "text" | "image";

export interface WatermarkTextConfig {
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  color: string;
  position: "center" | "diagonal" | "top" | "bottom";
}

export interface WatermarkImageConfig {
  opacity: number;
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  scale: number;
}

export function validateWatermarkPdfFile(file: { type: string; size: number }): string | null {
  if (file.size <= 0) {
    return "File kosong. Silakan upload file PDF yang valid.";
  }

  if (file.type !== "application/pdf") {
    return "Tipe file tidak valid. Hanya file PDF yang diterima.";
  }

  const maxSizeBytes = 20 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return "Ukuran file terlalu besar. Maksimal 20MB.";
  }

  return null;
}

export function validateWatermarkImageFile(file: { type: string; size: number }): string | null {
  if (file.size <= 0) {
    return "File kosong. Silakan upload gambar watermark yang valid.";
  }

  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return "Tipe file tidak valid. Hanya gambar JPG, PNG, atau WEBP yang diterima.";
  }

  const maxSizeBytes = 2 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return "Ukuran gambar terlalu besar. Maksimal 2MB.";
  }

  return null;
}

export function validateWatermarkTextConfig(config: WatermarkTextConfig): string | null {
  if (!config.text.trim()) {
    return "Teks watermark tidak boleh kosong.";
  }

  if (config.text.length > 50) {
    return "Teks watermark maksimal 50 karakter.";
  }

  if (config.fontSize < 12 || config.fontSize > 72) {
    return "Ukuran font harus antara 12 dan 72.";
  }

  if (config.opacity < 0.1 || config.opacity > 1) {
    return "Opacity harus antara 10% dan 100%.";
  }

  if (config.rotation < -45 || config.rotation > 45) {
    return "Rotasi harus antara -45° dan 45°.";
  }

  if (!/^#[0-9a-fA-F]{6}$/.test(config.color)) {
    return "Warna harus dalam format hex, contoh #CCCCCC.";
  }

  return null;
}

export function validateWatermarkImageConfig(config: WatermarkImageConfig): string | null {
  if (config.opacity < 0.1 || config.opacity > 1) {
    return "Opacity harus antara 10% dan 100%.";
  }

  if (config.scale < 0.1 || config.scale > 1) {
    return "Scale harus antara 10% dan 100%.";
  }

  return null;
}

export function isValidWatermarkTab(tab: string): tab is WatermarkTab {
  return tab === "text" || tab === "image";
}

export interface WatermarkOverlayStyle {
  x: number;
  y: number;
  rotationDegrees: number;
}

export function calculateTextOverlayStyle(
  config: WatermarkTextConfig,
  canvasWidth: number,
  canvasHeight: number,
): WatermarkOverlayStyle {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  switch (config.position) {
    case "center":
      return { x: centerX, y: centerY, rotationDegrees: config.rotation };
    case "diagonal":
      return { x: centerX, y: centerY, rotationDegrees: -30 };
    case "top":
      return { x: centerX, y: Math.max(48, canvasHeight * 0.2), rotationDegrees: config.rotation };
    case "bottom":
      return {
        x: centerX,
        y: Math.min(canvasHeight - 48, canvasHeight * 0.8),
        rotationDegrees: config.rotation,
      };
    default:
      return { x: centerX, y: centerY, rotationDegrees: config.rotation };
  }
}

export function calculateImageOverlayStyle(
  config: WatermarkImageConfig,
  canvasWidth: number,
  canvasHeight: number,
): WatermarkOverlayStyle {
  const insetX = Math.max(24, canvasWidth * 0.12);
  const insetY = Math.max(24, canvasHeight * 0.12);

  switch (config.position) {
    case "center":
      return { x: canvasWidth / 2, y: canvasHeight / 2, rotationDegrees: 0 };
    case "top-left":
      return { x: insetX, y: insetY, rotationDegrees: 0 };
    case "top-right":
      return { x: canvasWidth - insetX, y: insetY, rotationDegrees: 0 };
    case "bottom-left":
      return { x: insetX, y: canvasHeight - insetY, rotationDegrees: 0 };
    case "bottom-right":
      return { x: canvasWidth - insetX, y: canvasHeight - insetY, rotationDegrees: 0 };
    default:
      return { x: canvasWidth / 2, y: canvasHeight / 2, rotationDegrees: 0 };
  }
}

export function calculatePreviewDimensions(
  pageWidth: number,
  pageHeight: number,
  maxWidth = 720,
  maxHeight = 960,
): { width: number; height: number; scale: number } {
  if (pageWidth <= 0 || pageHeight <= 0) {
    return { width: 480, height: 640, scale: 1 };
  }

  const widthScale = maxWidth / pageWidth;
  const heightScale = maxHeight / pageHeight;
  const scale = Math.min(widthScale, heightScale, 1);

  return {
    width: Math.max(240, Math.round(pageWidth * scale)),
    height: Math.max(320, Math.round(pageHeight * scale)),
    scale,
  };
}

export function createDebouncedRunner(delayMs: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return {
    run(callback: () => void) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        callback();
        timer = null;
      }, delayMs);
    },
    cancel() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    },
  };
}

export function hexToRgba(hex: string, opacity: number): string {
  const normalized = hex.replace("#", "");
  const red = Number.parseInt(normalized.substring(0, 2), 16);
  const green = Number.parseInt(normalized.substring(2, 4), 16);
  const blue = Number.parseInt(normalized.substring(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

export function getPreviewState(params: {
  hasPdf: boolean;
  isRendering: boolean;
  errorMessage: string;
}): "placeholder" | "loading" | "error" | "ready" {
  if (!params.hasPdf) return "placeholder";
  if (params.errorMessage) return "error";
  if (params.isRendering) return "loading";
  return "ready";
}

/** STEP-F2-018: Image watermark API helpers */

export type WatermarkApiErrorType =
  | "validation_error"
  | "rate_limit"
  | "server_error"
  | "network_error"
  | "timeout";

export function getWatermarkFailureReason(status: number): WatermarkApiErrorType {
  if (status === 429) return "rate_limit";
  if (status >= 400 && status < 500) return "validation_error";
  return "server_error";
}

export function getWatermarkErrorMessage(
  status: number,
  detail?: string,
): string {
  if (status === 429) return "Terlalu banyak permintaan. Coba lagi nanti.";
  if (detail) return detail;
  if (status >= 500) return "Gagal memproses file. Silakan coba lagi.";
  return "Gagal memproses watermark gambar.";
}

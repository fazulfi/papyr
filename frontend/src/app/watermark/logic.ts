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

export type UnlockFailureReason =
  | "rate_limit"
  | "wrong_password"
  | "not_encrypted"
  | "validation_error"
  | "server_error";

export function validateUnlockFile(file: Pick<File, "type" | "size">): string | null {
  if (!file.type || file.type !== "application/pdf") {
    return "Tipe file tidak valid. Hanya file PDF yang diterima.";
  }

  if (file.size === 0) {
    return "File kosong. Silakan upload file PDF yang valid.";
  }

  if (file.size > 20 * 1024 * 1024) {
    return "Ukuran file terlalu besar. Maksimal 20MB.";
  }

  return null;
}

export function validateUnlockPassword(password: string): string | null {
  if (password.length < 4) return "Password minimal 4 karakter.";
  if (password.length > 128) return "Password maksimal 128 karakter.";
  return null;
}

export function getUnlockFailureReason(status: number): UnlockFailureReason {
  if (status === 429) return "rate_limit";
  if (status === 401) return "wrong_password";
  if (status === 400) return "not_encrypted";
  if (status >= 400 && status < 500) return "validation_error";
  return "server_error";
}

export function getUnlockErrorMessage(status: number, detail?: string): string {
  if (status === 429) return "Terlalu banyak permintaan. Coba lagi dalam 1 menit.";
  if (status === 401) return "Password salah, coba lagi.";
  if (status === 400) return detail || "PDF ini tidak terproteksi.";
  if (status >= 400 && status < 500) return detail || "Terjadi kesalahan validasi.";
  return "Gagal memproses file. Silakan coba lagi.";
}

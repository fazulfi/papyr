export type ProtectFailureReason =
  | "rate_limit"
  | "already_encrypted"
  | "validation_error"
  | "server_error";

export function validateProtectFile(file: Pick<File, "type" | "size">): string | null {
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

export function validateProtectPassword(
  password: string,
  confirmPassword: string,
): string | null {
  if (password.length < 4) return "Password minimal 4 karakter.";
  if (password.length > 128) return "Password maksimal 128 karakter.";
  if (password !== confirmPassword) {
    return "Password dan konfirmasi password tidak cocok.";
  }
  return null;
}

export function isValidEncryptionMethod(
  value: string,
): value is "aes128" | "aes256" {
  return value === "aes128" || value === "aes256";
}

export function getProtectFailureReason(status: number): ProtectFailureReason {
  if (status === 429) return "rate_limit";
  if (status === 409) return "already_encrypted";
  if (status >= 400 && status < 500) return "validation_error";
  return "server_error";
}

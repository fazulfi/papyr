import { describe, expect, it } from "vitest";
import {
  getUnlockErrorMessage,
  getUnlockFailureReason,
  validateUnlockFile,
  validateUnlockPassword,
} from "@/app/unlock/logic";

describe("STEP-F2-011 — /unlock logic coverage", () => {
  describe("unlock file validation", () => {
    it("rejects non-PDF mime type", () => {
      const result = validateUnlockFile({ type: "image/png", size: 1024 });
      expect(result).toBe("Tipe file tidak valid. Hanya file PDF yang diterima.");
    });

    it("rejects empty file", () => {
      const result = validateUnlockFile({ type: "application/pdf", size: 0 });
      expect(result).toBe("File kosong. Silakan upload file PDF yang valid.");
    });

    it("rejects file larger than 20MB", () => {
      const result = validateUnlockFile({
        type: "application/pdf",
        size: 20 * 1024 * 1024 + 1,
      });
      expect(result).toBe("Ukuran file terlalu besar. Maksimal 20MB.");
    });

    it("accepts valid PDF file", () => {
      const result = validateUnlockFile({ type: "application/pdf", size: 1024 });
      expect(result).toBeNull();
    });
  });

  describe("unlock password validation", () => {
    it("rejects password shorter than 4 chars", () => {
      expect(validateUnlockPassword("abc")).toBe("Password minimal 4 karakter.");
    });

    it("rejects password longer than 128 chars", () => {
      expect(validateUnlockPassword("a".repeat(129))).toBe("Password maksimal 128 karakter.");
    });

    it("accepts valid password", () => {
      expect(validateUnlockPassword("test1234")).toBeNull();
    });
  });

  describe("unlock error mapping", () => {
    it("maps expected failure reasons for analytics", () => {
      expect(getUnlockFailureReason(429)).toBe("rate_limit");
      expect(getUnlockFailureReason(401)).toBe("wrong_password");
      expect(getUnlockFailureReason(400)).toBe("not_encrypted");
      expect(getUnlockFailureReason(422)).toBe("validation_error");
      expect(getUnlockFailureReason(500)).toBe("server_error");
    });

    it("returns user-friendly Indonesian messages", () => {
      expect(getUnlockErrorMessage(401)).toBe("Password salah, coba lagi.");
      expect(getUnlockErrorMessage(400)).toBe("PDF ini tidak terproteksi.");
      expect(getUnlockErrorMessage(429)).toBe("Terlalu banyak permintaan. Coba lagi dalam 1 menit.");
      expect(getUnlockErrorMessage(422, "Ekstensi file tidak valid.")).toBe("Ekstensi file tidak valid.");
      expect(getUnlockErrorMessage(500)).toBe("Gagal memproses file. Silakan coba lagi.");
    });
  });
});

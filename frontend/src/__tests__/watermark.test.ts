import { describe, expect, it } from "vitest";
import {
  isValidWatermarkTab,
  validateWatermarkImageConfig,
  validateWatermarkImageFile,
  validateWatermarkPdfFile,
  validateWatermarkTextConfig,
} from "@/app/watermark/logic";
import {
  calculatePasswordStrength,
  getPasswordStrengthLevel,
} from "@/components/PasswordInput";

describe("STEP-F2-014 — /watermark UI and logic coverage", () => {
  describe("watermark PDF validation", () => {
    it("rejects non-PDF files", () => {
      expect(validateWatermarkPdfFile({ type: "image/png", size: 1024 })).toBe(
        "Tipe file tidak valid. Hanya file PDF yang diterima.",
      );
    });

    it("rejects empty PDF files", () => {
      expect(validateWatermarkPdfFile({ type: "application/pdf", size: 0 })).toBe(
        "File kosong. Silakan upload file PDF yang valid.",
      );
    });

    it("rejects PDF files above 20MB", () => {
      expect(
        validateWatermarkPdfFile({ type: "application/pdf", size: 20 * 1024 * 1024 + 1 }),
      ).toBe("Ukuran file terlalu besar. Maksimal 20MB.");
    });

    it("accepts valid PDF files", () => {
      expect(validateWatermarkPdfFile({ type: "application/pdf", size: 1024 })).toBeNull();
    });
  });

  describe("watermark image validation", () => {
    it("rejects invalid image mime types", () => {
      expect(validateWatermarkImageFile({ type: "application/pdf", size: 1024 })).toBe(
        "Tipe file tidak valid. Hanya gambar JPG, PNG, atau WEBP yang diterima.",
      );
    });

    it("rejects image files above 2MB", () => {
      expect(
        validateWatermarkImageFile({ type: "image/png", size: 2 * 1024 * 1024 + 1 }),
      ).toBe("Ukuran gambar terlalu besar. Maksimal 2MB.");
    });

    it("accepts valid image files", () => {
      expect(validateWatermarkImageFile({ type: "image/png", size: 1024 })).toBeNull();
    });
  });

  describe("watermark text config validation", () => {
    it("rejects empty watermark text", () => {
      expect(
        validateWatermarkTextConfig({
          text: "   ",
          fontSize: 32,
          opacity: 0.2,
          rotation: 0,
          color: "#CCCCCC",
          position: "center",
        }),
      ).toBe("Teks watermark tidak boleh kosong.");
    });

    it("rejects invalid text config ranges", () => {
      expect(
        validateWatermarkTextConfig({
          text: "CONFIDENTIAL",
          fontSize: 8,
          opacity: 0.2,
          rotation: 0,
          color: "#CCCCCC",
          position: "center",
        }),
      ).toBe("Ukuran font harus antara 12 dan 72.");

      expect(
        validateWatermarkTextConfig({
          text: "CONFIDENTIAL",
          fontSize: 32,
          opacity: 0.05,
          rotation: 0,
          color: "#CCCCCC",
          position: "center",
        }),
      ).toBe("Opacity harus antara 10% dan 100%.");

      expect(
        validateWatermarkTextConfig({
          text: "CONFIDENTIAL",
          fontSize: 32,
          opacity: 0.2,
          rotation: 50,
          color: "#CCCCCC",
          position: "center",
        }),
      ).toBe("Rotasi harus antara -45° dan 45°.");
    });

    it("rejects invalid hex color and long text", () => {
      expect(
        validateWatermarkTextConfig({
          text: "A".repeat(51),
          fontSize: 32,
          opacity: 0.2,
          rotation: 0,
          color: "#CCCCCC",
          position: "center",
        }),
      ).toBe("Teks watermark maksimal 50 karakter.");

      expect(
        validateWatermarkTextConfig({
          text: "CONFIDENTIAL",
          fontSize: 32,
          opacity: 0.2,
          rotation: 0,
          color: "CCCCCC",
          position: "center",
        }),
      ).toBe("Warna harus dalam format hex, contoh #CCCCCC.");
    });

    it("accepts valid text config", () => {
      expect(
        validateWatermarkTextConfig({
          text: "CONFIDENTIAL",
          fontSize: 32,
          opacity: 0.2,
          rotation: -30,
          color: "#CCCCCC",
          position: "diagonal",
        }),
      ).toBeNull();
    });
  });

  describe("watermark image config validation", () => {
    it("rejects invalid opacity and scale ranges", () => {
      expect(validateWatermarkImageConfig({ opacity: 0.05, position: "center", scale: 0.5 })).toBe(
        "Opacity harus antara 10% dan 100%.",
      );
      expect(validateWatermarkImageConfig({ opacity: 0.5, position: "center", scale: 0.05 })).toBe(
        "Scale harus antara 10% dan 100%.",
      );
    });

    it("accepts valid image config", () => {
      expect(validateWatermarkImageConfig({ opacity: 0.75, position: "bottom-right", scale: 0.4 })).toBeNull();
    });
  });

  describe("utility helpers", () => {
    it("validates watermark tab names", () => {
      expect(isValidWatermarkTab("text")).toBe(true);
      expect(isValidWatermarkTab("image")).toBe(true);
      expect(isValidWatermarkTab("video")).toBe(false);
    });

    it("keeps password helper coverage available for related UI", () => {
      expect(getPasswordStrengthLevel(calculatePasswordStrength("abc"))).toBe("weak");
      expect(getPasswordStrengthLevel(calculatePasswordStrength("Abcdefgh"))).toBe("medium");
      expect(getPasswordStrengthLevel(calculatePasswordStrength("Abcdefg1!"))).toBe("strong");
    });
  });
});

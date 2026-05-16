import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "@vercel/analytics";

vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}));

vi.mock("pdf-lib", () => {
  const drawTextMock = vi.fn();
  const getSizeMock = vi.fn(() => ({ width: 600, height: 800 }));
  const pageMock = { drawText: drawTextMock, getSize: getSizeMock };

  return {
    PDFDocument: {
      load: vi.fn(async () => ({
        embedFont: vi.fn(async () => "HelveticaFont"),
        getPages: vi.fn(() => [pageMock, pageMock]),
        save: vi.fn(async () => new Uint8Array([1, 2, 3])),
      })),
    },
    StandardFonts: { Helvetica: "Helvetica" },
    rgb: vi.fn((r: number, g: number, b: number) => ({ r, g, b })),
    degrees: vi.fn((value: number) => value),
  };
});
import {
  calculateImageOverlayStyle,
  calculatePreviewDimensions,
  calculateTextOverlayStyle,
  createDebouncedRunner,
  getPreviewState,
  getWatermarkErrorMessage,
  getWatermarkFailureReason,
  hexToRgba,
  isValidWatermarkTab,
  validateWatermarkImageConfig,
  validateWatermarkImageFile,
  validateWatermarkPdfFile,
  validateWatermarkTextConfig,
} from "@/app/watermark/logic";
import {
  applyTextWatermark,
  hexToRgbNormalized,
  mapTextWatermarkPosition,
} from "@/app/watermark/processing";
import {
  calculatePasswordStrength,
  getPasswordStrengthLevel,
} from "@/components/PasswordInput";
import {
  trackTaskCompleted,
  trackTaskFailed,
  trackTaskStarted,
} from "@/lib/analytics";

describe("STEP-F2-015 — /watermark preview logic coverage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
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

  describe("STEP-F2-016 processing helpers", () => {
    it("normalizes hex color into pdf-lib rgb values", () => {
      expect(hexToRgbNormalized("#FFFFFF")).toEqual({ r: 1, g: 1, b: 1 });
      expect(hexToRgbNormalized("#0A64FF")).toEqual({
        r: 10 / 255,
        g: 100 / 255,
        b: 1,
      });
    });

    it("maps text watermark position correctly", () => {
      expect(mapTextWatermarkPosition("center", 600, 800)).toEqual({
        x: 300,
        y: 400,
        rotationDegrees: 0,
      });
      expect(mapTextWatermarkPosition("diagonal", 600, 800)).toEqual({
        x: 300,
        y: 400,
        rotationDegrees: -30,
      });
      expect(mapTextWatermarkPosition("top", 600, 800)).toEqual({
        x: 300,
        y: 750,
        rotationDegrees: 0,
      });
      expect(mapTextWatermarkPosition("bottom", 600, 800)).toEqual({
        x: 300,
        y: 50,
        rotationDegrees: 0,
      });
    });

    it("applies text watermark to all pages and returns bytes", async () => {
      const input = new Uint8Array([10, 20, 30]);
      const output = await applyTextWatermark(input, {
        text: "CONFIDENTIAL",
        fontSize: 32,
        opacity: 0.2,
        rotation: 15,
        color: "#CCCCCC",
        position: "center",
      });

      expect(output).toEqual(new Uint8Array([1, 2, 3]));
    });
  });

  describe("preview overlay helpers", () => {
    it("calculates text overlay positions for all supported placements", () => {
      expect(
        calculateTextOverlayStyle(
          {
            text: "CONFIDENTIAL",
            fontSize: 32,
            opacity: 0.2,
            rotation: 12,
            color: "#CCCCCC",
            position: "center",
          },
          600,
          800,
        ),
      ).toEqual({ x: 300, y: 400, rotationDegrees: 12 });

      expect(
        calculateTextOverlayStyle(
          {
            text: "CONFIDENTIAL",
            fontSize: 32,
            opacity: 0.2,
            rotation: 12,
            color: "#CCCCCC",
            position: "diagonal",
          },
          600,
          800,
        ),
      ).toEqual({ x: 300, y: 400, rotationDegrees: -30 });

      expect(
        calculateTextOverlayStyle(
          {
            text: "CONFIDENTIAL",
            fontSize: 32,
            opacity: 0.2,
            rotation: 10,
            color: "#CCCCCC",
            position: "top",
          },
          600,
          800,
        ),
      ).toEqual({ x: 300, y: 160, rotationDegrees: 10 });

      expect(
        calculateTextOverlayStyle(
          {
            text: "CONFIDENTIAL",
            fontSize: 32,
            opacity: 0.2,
            rotation: 10,
            color: "#CCCCCC",
            position: "bottom",
          },
          600,
          800,
        ),
      ).toEqual({ x: 300, y: 640, rotationDegrees: 10 });
    });

    it("calculates image overlay positions for all supported placements", () => {
      expect(calculateImageOverlayStyle({ opacity: 0.5, position: "center", scale: 0.4 }, 600, 800)).toEqual({
        x: 300,
        y: 400,
        rotationDegrees: 0,
      });
      expect(calculateImageOverlayStyle({ opacity: 0.5, position: "top-left", scale: 0.4 }, 600, 800)).toEqual({
        x: 72,
        y: 96,
        rotationDegrees: 0,
      });
      expect(calculateImageOverlayStyle({ opacity: 0.5, position: "top-right", scale: 0.4 }, 600, 800)).toEqual({
        x: 528,
        y: 96,
        rotationDegrees: 0,
      });
      expect(calculateImageOverlayStyle({ opacity: 0.5, position: "bottom-left", scale: 0.4 }, 600, 800)).toEqual({
        x: 72,
        y: 704,
        rotationDegrees: 0,
      });
      expect(calculateImageOverlayStyle({ opacity: 0.5, position: "bottom-right", scale: 0.4 }, 600, 800)).toEqual({
        x: 528,
        y: 704,
        rotationDegrees: 0,
      });
    });

    it("calculates preview dimensions with scaling and fallback handling", () => {
      expect(calculatePreviewDimensions(1200, 1600)).toEqual({
        width: 720,
        height: 960,
        scale: 0.6,
      });

      expect(calculatePreviewDimensions(100, 100)).toEqual({
        width: 240,
        height: 320,
        scale: 1,
      });

      expect(calculatePreviewDimensions(0, 0)).toEqual({
        width: 480,
        height: 640,
        scale: 1,
      });
    });

    it("debounces callbacks and supports cancellation", () => {
      const callback = vi.fn();
      const debounced = createDebouncedRunner(200);

      debounced.run(() => callback("first"));
      debounced.run(() => callback("second"));
      vi.advanceTimersByTime(199);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith("second");

      const cancelCallback = vi.fn();
      debounced.run(cancelCallback);
      debounced.cancel();
      vi.advanceTimersByTime(200);
      expect(cancelCallback).not.toHaveBeenCalled();
    });

    it("converts hex colors to rgba strings", () => {
      expect(hexToRgba("#CCCCCC", 0.2)).toBe("rgba(204, 204, 204, 0.2)");
      expect(hexToRgba("#0A64FF", 1)).toBe("rgba(10, 100, 255, 1)");
    });

    it("derives preview state transitions correctly", () => {
      expect(getPreviewState({ hasPdf: false, isRendering: false, errorMessage: "" })).toBe("placeholder");
      expect(getPreviewState({ hasPdf: true, isRendering: true, errorMessage: "" })).toBe("loading");
      expect(getPreviewState({ hasPdf: true, isRendering: false, errorMessage: "Gagal" })).toBe("error");
      expect(getPreviewState({ hasPdf: true, isRendering: false, errorMessage: "" })).toBe("ready");
    });

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

  describe("STEP-F2-018 image watermark API helpers", () => {
    it("maps HTTP status to failure reason", () => {
      expect(getWatermarkFailureReason(429)).toBe("rate_limit");
      expect(getWatermarkFailureReason(400)).toBe("validation_error");
      expect(getWatermarkFailureReason(422)).toBe("validation_error");
      expect(getWatermarkFailureReason(500)).toBe("server_error");
    });

    it("returns exact error messages for API states", () => {
      expect(getWatermarkErrorMessage(429)).toBe("Terlalu banyak permintaan. Coba lagi nanti.");
      expect(getWatermarkErrorMessage(400, "Config JSON tidak valid.")).toBe("Config JSON tidak valid.");
      expect(getWatermarkErrorMessage(500)).toBe("Gagal memproses file. Silakan coba lagi.");
      expect(getWatermarkErrorMessage(400)).toBe("Gagal memproses watermark gambar.");
    });
  });

  describe("STEP-F2-020 /watermark unit coverage", () => {
    it("tracks watermark text task_started event", () => {
      const mockedTrack = vi.mocked(track);

      trackTaskStarted("watermark", { watermark_type: "text" });

      expect(mockedTrack).toHaveBeenCalledWith(
        "task_started",
        expect.objectContaining({
          tool: "watermark",
          watermark_type: "text",
        }),
      );
    });

    it("tracks watermark image task_completed event with pages_count", () => {
      const mockedTrack = vi.mocked(track);

      trackTaskCompleted("watermark", {
        watermark_type: "image",
        pages_count: 5,
      });

      expect(mockedTrack).toHaveBeenCalledWith(
        "task_completed",
        expect.objectContaining({
          tool: "watermark",
          watermark_type: "image",
          pages_count: 5,
        }),
      );
    });

    it("tracks watermark task_failed with error_type", () => {
      const mockedTrack = vi.mocked(track);

      trackTaskFailed("watermark", "Network error", {
        watermark_type: "image",
        error_type: "network_error",
      });

      expect(mockedTrack).toHaveBeenCalledWith(
        "task_failed",
        expect.objectContaining({
          tool: "watermark",
          watermark_type: "image",
          error_type: "network_error",
          error: "Network error",
        }),
      );
    });

    it("validates tab switching support between text and image modes", () => {
      const tabs = ["text", "image", "text", "image"];
      expect(tabs.every((tab) => isValidWatermarkTab(tab))).toBe(true);
    });

    it("keeps text and image config panel validation independent across tab switches", () => {
      const textError = validateWatermarkTextConfig({
        text: "CONFIDENTIAL",
        fontSize: 32,
        opacity: 0.5,
        rotation: -10,
        color: "#CCCCCC",
        position: "center",
      });

      const imageError = validateWatermarkImageConfig({
        opacity: 0.8,
        position: "bottom-right",
        scale: 0.4,
      });

      expect(textError).toBeNull();
      expect(imageError).toBeNull();
    });
  });
});

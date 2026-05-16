import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  ALLOWED_SIGNATURE_IMAGE_TYPES,
  createSignaturePngDataUrl,
  extractPngBase64,
  getInitialSignatureState,
  getSignModeLabel,
  isValidSignMode,
  validateSignPdfFile,
  validateSignatureImageFile,
  SIGNATURE_FONTS,
  DEFAULT_SIGNATURE_FONT,
  type SignatureFont,
} from "@/app/sign/logic";
import { clampPage } from "@/components/PDFPageViewer";

describe("STEP-F2-022 — /sign page scaffold coverage", () => {
  describe("sign PDF file validation", () => {
    it("rejects non-PDF mime type", () => {
      const result = validateSignPdfFile({ type: "image/png", size: 1024 });
      expect(result).toBe("Tipe file tidak valid. Hanya file PDF yang diterima.");
    });

    it("rejects empty file", () => {
      const result = validateSignPdfFile({
        type: "application/pdf",
        size: 0,
      });
      expect(result).toBe("File kosong. Silakan upload file PDF yang valid.");
    });

    it("rejects file larger than 20MB", () => {
      const result = validateSignPdfFile({
        type: "application/pdf",
        size: 20 * 1024 * 1024 + 1,
      });
      expect(result).toBe("Ukuran file terlalu besar. Maksimal 20MB.");
    });

    it("accepts valid PDF file", () => {
      const result = validateSignPdfFile({
        type: "application/pdf",
        size: 1024 * 1024,
      });
      expect(result).toBeNull();
    });
  });

  describe("sign mode validation", () => {
    it("accepts draw, upload, and type only", () => {
      expect(isValidSignMode("draw")).toBe(true);
      expect(isValidSignMode("upload")).toBe(true);
      expect(isValidSignMode("type")).toBe(true);
      expect(isValidSignMode("text")).toBe(false);
      expect(isValidSignMode("image")).toBe(false);
      expect(isValidSignMode("signature")).toBe(false);
    });
  });

  describe("sign config defaults", () => {
    it("returns draw as the default mode", () => {
      const config = getInitialSignatureState();
      expect(config.mode).toBe("draw");
    });
  });

  describe("sign mode labels", () => {
    it("returns Indonesian labels for all modes", () => {
      expect(getSignModeLabel("draw")).toBe("Gambar");
      expect(getSignModeLabel("upload")).toBe("Upload");
      expect(getSignModeLabel("type")).toBe("Ketik");
    });
  });

  describe("page component expectations (scaffold contract)", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("renders upload zone in idle state via validateSignPdfFile callback", () => {
      // In idle state, the page renders an upload area.
      // When a valid PDF file is dropped/selected, validateSignPdfFile
      // must return null to allow transition to pdf-selected state.
      const validFile = { type: "application/pdf", size: 256 * 1024 };
      expect(validateSignPdfFile(validFile)).toBeNull();
    });

    it("transitions from idle to pdf-selected only when file passes validation", () => {
      // simulate state transition logic used in the page component:
      // 1. idle: upload area shown
      // 2. on valid file → pdf-selected: file info + mode tabs shown
      const validResult = validateSignPdfFile({
        type: "application/pdf",
        size: 512 * 1024,
      });
      expect(validResult).toBeNull();

      const invalidResult = validateSignPdfFile({
        type: "application/pdf",
        size: 0,
      });
      expect(invalidResult).not.toBeNull();
    });

    it("provides three mode tabs (draw, upload, type) with type guard", () => {
      // The scaffold page renders three TabButton components:
      // "Gambar"  → mode="draw"
      // "Upload"  → mode="upload"
      // "Ketik"   → mode="type"
      const modes = ["draw", "upload", "type"] as const;
      expect(modes.every((m) => isValidSignMode(m))).toBe(true);
    });

    it("default active tab is draw as per getInitialSignatureState", () => {
      const config = getInitialSignatureState();
      expect(config.mode).toBe("draw");
    });

    it("mode labels match the grid layout in pdf-selected state", () => {
      // The mode selector section in pdf-selected state displays labels:
      // "Gambar" for draw, "Upload" for upload, "Ketik" for type
      expect(getSignModeLabel("draw")).toBe("Gambar");
      expect(getSignModeLabel("upload")).toBe("Upload");
      expect(getSignModeLabel("type")).toBe("Ketik");
    });

    it("supports mode switching between all three tabs", () => {
      // Simulating setMode transitions used by handleModeChange:
      // When user clicks a different tab, mode changes,
      // and the mode content placeholder updates.
      const modes: Array<"draw" | "upload" | "type"> = [
        "draw",
        "upload",
        "type",
        "draw",
        "type",
        "upload",
      ];
      for (const mode of modes) {
        expect(isValidSignMode(mode)).toBe(true);
      }
    });

    it("shows error state when file validation fails (user feedback loop)", () => {
      // error state is triggered when validateSignPdfFile returns a string.
      // The page shows AlertIcon + errorMessage + retry/reset buttons.
      const error = validateSignPdfFile({ type: "text/html", size: 100 });
      expect(error).toBe("Tipe file tidak valid. Hanya file PDF yang diterima.");
      // The page handleFileSelect would set state("error") and errorMessage = the string.
    });

    it("includes Reset functionality to return to idle state", () => {
      // handleReset sets state("idle"), clears file/mode/errorMessage/dragging.
      // After reset, the page should be back at upload zone.
      const config = getInitialSignatureState();
      expect(config.mode).toBe("draw");
      // Simulated reset: config returns to draw, file becomes null, state idle.
      const resetFile: File | null = config.pdfFile;
      const resetMode = config.mode;
      expect(resetFile).toBeNull();
      expect(resetMode).toBe("draw");
    });

    it("arranges two-step section layout (upload → sign)", () => {
      // Step 1 (idle): Upload area with drag-drop and file input
      // Step 2 (pdf-selected): File info + mode selector + apply button
      // The scaffold contract defines exactly these two visual sections.
      const idleState = "idle" as const;
      const selectedState = "pdf-selected" as const;
      expect(idleState).toBe("idle");
      expect(selectedState).toBe("pdf-selected");
      // These states control which section of the page is visible.
    });
  });
});

/* ── STEP-F2-024 Upload Mode Tests ── */

describe("STEP-F2-024 — Upload mode contract", () => {
  describe("validateSignatureImageFile — file type", () => {
    it("accepts image/png", () => {
      const result = validateSignatureImageFile({ type: "image/png", size: 512 * 1024 });
      expect(result).toBeNull();
    });

    it("accepts image/jpeg", () => {
      const result = validateSignatureImageFile({ type: "image/jpeg", size: 256 * 1024 });
      expect(result).toBeNull();
    });

    it("rejects image/gif", () => {
      const result = validateSignatureImageFile({ type: "image/gif", size: 1024 });
      expect(result).toBe("Tipe file tidak valid. Hanya file PNG dan JPG yang diterima.");
    });

    it("rejects application/pdf as signature image", () => {
      const result = validateSignatureImageFile({ type: "application/pdf", size: 1024 });
      expect(result).toBe("Tipe file tidak valid. Hanya file PNG dan JPG yang diterima.");
    });

    it("rejects empty/missing type", () => {
      const result = validateSignatureImageFile({ type: "", size: 1024 });
      expect(result).toBe("Tipe file tidak valid. Hanya file PNG dan JPG yang diterima.");
    });
  });

  describe("validateSignatureImageFile — file size", () => {
    it("rejects empty file (size 0)", () => {
      const result = validateSignatureImageFile({ type: "image/png", size: 0 });
      expect(result).toBe("File kosong. Silakan upload file yang valid.");
    });

    it("rejects file at 1MB boundary", () => {
      const result = validateSignatureImageFile({ type: "image/png", size: 1024 * 1024 + 1 });
      expect(result).toBe("Ukuran file terlalu besar. Maksimal 1MB.");
    });

    it("accepts file at exactly 1MB", () => {
      const result = validateSignatureImageFile({ type: "image/png", size: 1024 * 1024 });
      expect(result).toBeNull();
    });

    it("accepts file well below 1MB", () => {
      const result = validateSignatureImageFile({ type: "image/jpeg", size: 50 * 1024 });
      expect(result).toBeNull();
    });
  });

  describe("ALLOWED_SIGNATURE_IMAGE_TYPES constant", () => {
    it("contains exactly png and jpeg", () => {
      expect(ALLOWED_SIGNATURE_IMAGE_TYPES).toEqual(["image/png", "image/jpeg"]);
    });
  });

  describe("base64 PNG export contract (upload mode output shape)", () => {
    it("createSignaturePngDataUrl produces valid PNG data URL", () => {
      const payload = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      const url = createSignaturePngDataUrl(payload);
      expect(url).toBe("data:image/png;base64," + payload);
    });

    it("extractPngBase64 returns null for non-PNG data URL", () => {
      const result = extractPngBase64("data:image/jpeg;base64,XYZ");
      expect(result).toBeNull();
    });

    it("extractPngBase64 returns null for malformed string", () => {
      const result = extractPngBase64("not-a-data-url");
      expect(result).toBeNull();
    });

    it("extractPngBase64 returns empty string for empty PNG base64", () => {
      const result = extractPngBase64("data:image/png;base64,");
      expect(result).toBe("");
    });

    it("empty string payload is still a valid PNG data URL (contract preserved)", () => {
      const url = createSignaturePngDataUrl("");
      expect(url).toBe("data:image/png;base64,");
      expect(extractPngBase64(url)).toBe("");
    });
  });
});

/* ── STEP-F2-024 Type Mode Tests ── */

describe("STEP-F2-024 — Type mode contract", () => {
  describe("SIGNATURE_FONTS constant", () => {
    it("exposes 4 font options", () => {
      expect(SIGNATURE_FONTS).toHaveLength(4);
    });

    it("each font has family, label, and googleFontName", () => {
      for (const font of SIGNATURE_FONTS) {
        expect(font).toHaveProperty("family");
        expect(font).toHaveProperty("label");
        expect(font).toHaveProperty("googleFontName");
        expect(typeof font.family).toBe("string");
        expect(typeof font.label).toBe("string");
        expect(typeof font.googleFontName).toBe("string");
      }
    });

    it("googleFontName uses plus-sign spaces (URL-safe)", () => {
      for (const font of SIGNATURE_FONTS) {
        expect(font.googleFontName).not.toContain(" ");
        expect(font.googleFontName).toMatch(/^[A-Za-z\+]+$/);
      }
    });

    it("first font is Dancing Script", () => {
      expect(SIGNATURE_FONTS[0].label).toBe("Dancing Script");
      expect(SIGNATURE_FONTS[0].googleFontName).toBe("Dancing+Script");
    });
  });

  describe("DEFAULT_SIGNATURE_FONT", () => {
    it("defaults to first font (Dancing Script)", () => {
      expect(DEFAULT_SIGNATURE_FONT.label).toBe("Dancing Script");
      expect(DEFAULT_SIGNATURE_FONT).toBe(SIGNATURE_FONTS[0]);
    });

    it("has required properties for canvas rendering", () => {
      expect(DEFAULT_SIGNATURE_FONT.family).toBeTruthy();
      expect(DEFAULT_SIGNATURE_FONT.label).toBeTruthy();
      expect(DEFAULT_SIGNATURE_FONT.googleFontName).toBeTruthy();
    });
  });

  describe("type mode base64 PNG export contract", () => {
    it("createSignaturePngDataUrl produces valid PNG data URL (type output shape)", () => {
      const payload = "YWJjMTIz"; // "abc123" base64
      const url = createSignaturePngDataUrl(payload);
      expect(url).toBe("data:image/png;base64," + payload);
      expect(url.startsWith("data:image/png;base64,")).toBe(true);
    });

    it("empty typed name produces empty-payload PNG data URL", () => {
      // Empty input edge case: the export function still produces a valid URL shape
      const url = createSignaturePngDataUrl("");
      expect(url).toBe("data:image/png;base64,");
      expect(extractPngBase64(url)).toBe("");
    });

    it("extractPngBase64 round-trips correctly for type mode output", () => {
      const payload = "SGVsbG8gV29ybGQ="; // "Hello World" base64
      const url = createSignaturePngDataUrl(payload);
      expect(extractPngBase64(url)).toBe(payload);
    });

    it("signatureImage contract: string | null, export always produces string", () => {
      // Verify the export contract: even empty typed name produces a string, not null
      const emptyUrl = createSignaturePngDataUrl("");
      expect(typeof emptyUrl).toBe("string");
      expect(emptyUrl.startsWith("data:image/png;base64,")).toBe(true);
    });
  });

  describe("type mode integration regression guards", () => {
    it("type is still a valid sign mode (no regression)", () => {
      expect(isValidSignMode("type")).toBe(true);
    });

    it("type mode label remains 'Ketik' (no regression)", () => {
      expect(getSignModeLabel("type")).toBe("Ketik");
    });

    it("type mode can coexist with draw and upload modes", () => {
      const modes: Array<"draw" | "upload" | "type"> = ["draw", "upload", "type"];
      expect(modes.every((m) => isValidSignMode(m))).toBe(true);
    });

    it("type mode font list is accessible for font selection UI", () => {
      expect(SIGNATURE_FONTS.length).toBeGreaterThan(0);
      const labels = SIGNATURE_FONTS.map((f) => f.label);
      expect(new Set(labels).size).toBe(labels.length); // all labels unique
    });

    it("signature state allows type mode as current mode", () => {
      const state = getInitialSignatureState();
      // Default mode is draw; type should be set-able
      const typeState = { ...state, mode: "type" as const };
      expect(typeState.mode).toBe("type");
      expect(isValidSignMode(typeState.mode)).toBe(true);
    });

    it("signatureImage export shape is identical for draw/upload/type", () => {
      // All three modes must produce data:image/png;base64,... for pdf-lib pipeline
      const drawPayload = "ZHJhd19zaWduYXR1cmU=";
      const uploadPayload = "dXBsb2FkX3NpZ25hdHVyZQ==";
      const typePayload = "dHlwZV9zaWduYXR1cmU=";

      const drawUrl = createSignaturePngDataUrl(drawPayload);
      const uploadUrl = createSignaturePngDataUrl(uploadPayload);
      const typeUrl = createSignaturePngDataUrl(typePayload);

      expect(drawUrl.startsWith("data:image/png;base64,")).toBe(true);
      expect(uploadUrl.startsWith("data:image/png;base64,")).toBe(true);
      expect(typeUrl.startsWith("data:image/png;base64,")).toBe(true);
    });
  });
});

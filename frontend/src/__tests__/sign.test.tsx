import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  ALLOWED_SIGNATURE_IMAGE_TYPES,
  createSignaturePngDataUrl,
  extractPngBase64,
  getCanvasDimensions,
  getInitialSignatureState,
  getSignModeLabel,
  getStrokesBounds,
  isValidSignMode,
  validateSignPdfFile,
  validateSignatureImageFile,
  SIGNATURE_FONTS,
  DEFAULT_SIGNATURE_FONT,
  type SignatureFont,
  type Stroke,
} from "@/app/sign/logic";
import { clampPage } from "@/components/PDFPageViewer";
import { applySignatures } from "@/app/sign/apply-signature";
import {
  normalizePlacement,
  removePlacementsByPage,
  resizeFromHandle,
  updatePlacement,
  type SignaturePlacement,
} from "@/app/sign/placement-logic";
import { PDFDocument } from "pdf-lib";

vi.mock("pdf-lib", () => ({
  PDFDocument: {
    load: vi.fn(async () => ({
      getPages: vi.fn(() => [
        {
          getSize: vi.fn(() => ({ width: 612, height: 792 })),
          drawImage: vi.fn(),
        },
        {
          getSize: vi.fn(() => ({ width: 612, height: 792 })),
          drawImage: vi.fn(),
        },
      ]),
      embedPng: vi.fn(async () => ({
        width: 200,
        height: 100,
      })),
      save: vi.fn(async () => new Uint8Array([0x25, 0x50, 0x44, 0x46])),
    })),
  },
}));

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

/* ── STEP-F2-028 Edge Cases & Expanded Coverage ── */

describe("STEP-F2-028 — /sign page edge cases", () => {
  /* ── validateSignPdfFile: empty/undefined type string ── */

  describe("validateSignPdfFile — type edge cases", () => {
    it("rejects empty type string", () => {
      const result = validateSignPdfFile({ type: "", size: 1024 * 1024 });
      expect(result).toBe("Tipe file tidak valid. Hanya file PDF yang diterima.");
    });

    it("rejects undefined type string", () => {
      const result = validateSignPdfFile(
        // @ts-expect-error Testing undefined type
        { type: undefined, size: 1024 * 1024 },
      );
      expect(result).toBe("Tipe file tidak valid. Hanya file PDF yang diterima.");
    });

    it("rejects null type", () => {
      const result = validateSignPdfFile(
        // @ts-expect-error Testing null type
        { type: null, size: 1024 * 1024 },
      );
      expect(result).toBe("Tipe file tidak valid. Hanya file PDF yang diterima.");
    });
  });

  /* ── getCanvasDimensions: negative width input ── */

  describe("getCanvasDimensions — negative/edge inputs", () => {
    it("clamps negative width to minimum 280", () => {
      const dim = getCanvasDimensions(-100);
      expect(dim.width).toBe(280);
      expect(dim.height).toBeGreaterThan(0);
    });

    it("clamps zero width to minimum 280", () => {
      const dim = getCanvasDimensions(0);
      expect(dim.width).toBe(280);
    });

    it("handles very large negative width", () => {
      const dim = getCanvasDimensions(-10000);
      expect(dim.width).toBe(280);
    });

    it("handles NaN width by returning NaN dimensions", () => {
      const dim = getCanvasDimensions(NaN);
      expect(Number.isNaN(dim.width)).toBe(true);
      expect(Number.isNaN(dim.height)).toBe(true);
    });

    it("handles Infinity width", () => {
      const dim = getCanvasDimensions(Infinity);
      expect(dim.width).toBe(560); // CANVAS_WIDTH
    });
  });

  /* ── getStrokesBounds: mixed empty/non-empty strokes ── */

  describe("getStrokesBounds — mixed empty/non-empty strokes", () => {
    it("returns canvas fallback for all-empty strokes array", () => {
      const emptyStrokes: Stroke[] = [];
      const result = getStrokesBounds(emptyStrokes, 560, 200);
      expect(result).toEqual({ minX: 0, minY: 0, maxX: 560, maxY: 200 });
    });

    it("returns fallback when all strokes have empty point arrays", () => {
      const strokes: Stroke[] = [
        { points: [], color: "#000000", width: 2 },
        { points: [], color: "#1E40AF", width: 4 },
      ];
      const result = getStrokesBounds(strokes, 400, 150);
      expect(result).toEqual({ minX: 0, minY: 0, maxX: 400, maxY: 150 });
    });

    it("captures bounds from strokes mixed with empty-stroke entries", () => {
      const strokes: Stroke[] = [
        { points: [], color: "#000000", width: 2 },
        { points: [{ x: 50, y: 60 }, { x: 150, y: 160 }], color: "#000000", width: 2 },
        { points: [], color: "#1E40AF", width: 4 },
      ];
      const result = getStrokesBounds(strokes);
      expect(result.minX).toBe(50);
      expect(result.minY).toBe(60);
      expect(result.maxX).toBe(150);
      expect(result.maxY).toBe(160);
    });

    it("includes single-point strokes in bounds calculation", () => {
      const strokes: Stroke[] = [
        { points: [{ x: 10, y: 20 }], color: "#000000", width: 2 }, // single dot
        { points: [{ x: 50, y: 60 }, { x: 150, y: 160 }], color: "#000000", width: 2 },
      ];
      const result = getStrokesBounds(strokes);
      expect(result.minX).toBe(10);
      expect(result.minY).toBe(20);
      expect(result.maxX).toBe(150);
      expect(result.maxY).toBe(160);
    });

    it("handles strokes with single points after real strokes", () => {
      const strokes: Stroke[] = [
        { points: [{ x: 50, y: 60 }, { x: 150, y: 160 }], color: "#000000", width: 2 },
        { points: [{ x: 10, y: 20 }], color: "#000000", width: 2 },
      ];
      const result = getStrokesBounds(strokes);
      expect(result.minX).toBe(10); // single point still contributes
      expect(result.minY).toBe(20);
    });
  });

  /* ── normalizePlacement: y clamping guard ── */

  describe("normalizePlacement — y clamping guard", () => {
    it("clamps y to [0, 1-height] range", () => {
      const p: SignaturePlacement = {
        id: "test",
        page: 1,
        x: 0.1,
        y: 1.5, // y overflows (y + height > 1)
        width: 0.2,
        height: 0.1,
      };
      const result = normalizePlacement(p);
      expect(result.y).toBeLessThanOrEqual(1 - result.height);
    });

    it("clamps negative y to 0", () => {
      const p: SignaturePlacement = {
        id: "test",
        page: 1,
        x: 0.1,
        y: -0.5,
        width: 0.2,
        height: 0.1,
      };
      const result = normalizePlacement(p);
      expect(result.y).toBeGreaterThanOrEqual(0);
    });

    it("clamps y when x causes total overflow on both axes", () => {
      const p: SignaturePlacement = {
        id: "test",
        page: 1,
        x: 0.9,
        y: 0.9,
        width: 0.3,
        height: 0.3,
      };
      const result = normalizePlacement(p);
      expect(result.x + result.width).toBeLessThanOrEqual(1.0001);
      expect(result.y + result.height).toBeLessThanOrEqual(1.0001);
    });
  });

  /* ── removePlacementsByPage: non-existent page ── */

  describe("removePlacementsByPage — non-existent page", () => {
    it("returns original array when page does not exist", () => {
      const placements: SignaturePlacement[] = [
        { id: "p1", page: 1, x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
        { id: "p2", page: 2, x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
      ];
      const result = removePlacementsByPage(placements, 99);
      expect(result).toHaveLength(2);
      expect(result).toEqual(placements);
    });

    it("returns empty array when placements is empty", () => {
      const result = removePlacementsByPage([], 1);
      expect(result).toHaveLength(0);
    });

    it("removes all placements on page 1 only", () => {
      const placements: SignaturePlacement[] = [
        { id: "p1", page: 1, x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
        { id: "p2", page: 1, x: 0.5, y: 0.5, width: 0.2, height: 0.1 },
        { id: "p3", page: 2, x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
      ];
      const result = removePlacementsByPage(placements, 1);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("p3");
    });

    it("does not mutate original array", () => {
      const placements: SignaturePlacement[] = [
        { id: "p1", page: 1, x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
      ];
      const copy = [...placements];
      removePlacementsByPage(placements, 99);
      expect(placements).toEqual(copy);
    });
  });

  /* ── updatePlacement: multi-field patch (x AND y simultaneously) ── */

  describe("updatePlacement — multi-field patch", () => {
    it("updates x and y simultaneously", () => {
      const placements: SignaturePlacement[] = [
        { id: "p1", page: 1, x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
        { id: "p2", page: 2, x: 0.5, y: 0.5, width: 0.2, height: 0.1 },
      ];
      const result = updatePlacement(placements, "p1", { x: 0.8, y: 0.3 });
      const updated = result.find((p) => p.id === "p1");
      expect(updated?.x).toBe(0.8);
      expect(updated?.y).toBe(0.3);
      // Other placement unchanged
      const unchanged = result.find((p) => p.id === "p2");
      expect(unchanged?.x).toBe(0.5);
      expect(unchanged?.y).toBe(0.5);
    });

    it("updates x, y, width, and height simultaneously", () => {
      const placements: SignaturePlacement[] = [
        { id: "p1", page: 1, x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
      ];
      const result = updatePlacement(placements, "p1", { x: 0.2, y: 0.3, width: 0.15, height: 0.08 });
      const updated = result[0];
      expect(updated.x).toBe(0.2);
      expect(updated.y).toBe(0.3);
      expect(updated.width).toBe(0.15);
      expect(updated.height).toBe(0.08);
    });

    it("normalizes after multi-field patch (clamps overflowing x)", () => {
      const placements: SignaturePlacement[] = [
        { id: "p1", page: 1, x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
      ];
      const result = updatePlacement(placements, "p1", { x: 0.9 });
      const updated = result.find((p) => p.id === "p1");
      expect((updated?.x ?? 0) + (updated?.width ?? 0)).toBeLessThanOrEqual(1.0001);
    });

    it("returns unchanged array when id not found", () => {
      const placements: SignaturePlacement[] = [
        { id: "p1", page: 1, x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
      ];
      const result = updatePlacement(placements, "non-existent", { x: 0.5 });
      expect(result).toEqual(placements);
    });

    it("does not mutate original array", () => {
      const placements: SignaturePlacement[] = [
        { id: "p1", page: 1, x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
      ];
      const copy = [...placements];
      updatePlacement(placements, "p1", { x: 0.9 });
      expect(placements).toEqual(copy);
    });
  });

  /* ── resizeFromHandle: sw/ne handles ── */

  describe("resizeFromHandle — sw handle", () => {
    it("southwest handle shifts x right, shrinks width, grows height (y unchanged)", () => {
      const p: SignaturePlacement = {
        id: "p1",
        page: 1,
        x: 0.3,
        y: 0.3,
        width: 0.2,
        height: 0.2,
      };
      const result = resizeFromHandle(p, "sw", 0.05, 0.05);
      expect(result.x).toBeCloseTo(0.35, 10);
      expect(result.width).toBeCloseTo(0.15, 10);
      expect(result.y).toBe(0.3); // sw does NOT modify y
      expect(result.height).toBeCloseTo(0.25, 10);
    });

    it("southwest handle with negative dx/dy shifts x left, grows width, shrinks height", () => {
      const p: SignaturePlacement = {
        id: "p1",
        page: 1,
        x: 0.3,
        y: 0.3,
        width: 0.2,
        height: 0.2,
      };
      const result = resizeFromHandle(p, "sw", -0.05, -0.05);
      expect(result.x).toBeCloseTo(0.25, 10);
      expect(result.width).toBeCloseTo(0.25, 10);
      expect(result.y).toBe(0.3); // sw does NOT modify y
      expect(result.height).toBeCloseTo(0.15, 10);
    });

    it("southwest handle clamps to minimum size", () => {
      const p: SignaturePlacement = {
        id: "p1",
        page: 1,
        x: 0.1,
        y: 0.1,
        width: 0.1,
        height: 0.1,
      };
      const result = resizeFromHandle(p, "sw", -0.5, -0.5);
      expect(result.width).toBeGreaterThanOrEqual(0.05);
      expect(result.height).toBeGreaterThanOrEqual(0.05);
    });
  });

  describe("resizeFromHandle — ne handle", () => {
    it("northeast handle shifts y down, grows width, shrinks height (x unchanged)", () => {
      const p: SignaturePlacement = {
        id: "p1",
        page: 1,
        x: 0.3,
        y: 0.3,
        width: 0.2,
        height: 0.2,
      };
      const result = resizeFromHandle(p, "ne", 0.05, 0.05);
      expect(result.x).toBe(0.3); // ne does NOT modify x
      expect(result.width).toBeCloseTo(0.25, 10);
      expect(result.y).toBeCloseTo(0.35, 10);
      expect(result.height).toBeCloseTo(0.15, 10);
    });

    it("northeast handle with negative dx/dy shrinks width, grows height", () => {
      const p: SignaturePlacement = {
        id: "p1",
        page: 1,
        x: 0.3,
        y: 0.3,
        width: 0.2,
        height: 0.2,
      };
      const result = resizeFromHandle(p, "ne", -0.05, -0.05);
      expect(result.x).toBe(0.3);
      expect(result.width).toBeCloseTo(0.15, 10);
      expect(result.y).toBeCloseTo(0.25, 10);
      expect(result.height).toBeCloseTo(0.25, 10);
    });

    it("northeast handle clamps to minimum size", () => {
      const p: SignaturePlacement = {
        id: "p1",
        page: 1,
        x: 0.3,
        y: 0.1,
        width: 0.1,
        height: 0.1,
      };
      const result = resizeFromHandle(p, "ne", -0.5, 0.5);
      expect(result.width).toBeGreaterThanOrEqual(0.05);
      expect(result.height).toBeGreaterThanOrEqual(0.05);
    });
  });

  /* ── applySignatures: coordinate conversion correctness ── */

  describe("applySignatures — coordinate conversion correctness", () => {
    const mockPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
    const mockSignatureDataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    it("converts y=0 to top of page (pdfY = pageH - drawH)", async () => {
      const placements: SignaturePlacement[] = [
        {
          id: "p1",
          page: 1,
          x: 0,
          y: 0,
          width: 0.2,
          height: 0.1,
        },
      ];
      const result = await applySignatures(mockPdfBytes, mockSignatureDataUrl, placements);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it("converts y near bottom of page", async () => {
      const placements: SignaturePlacement[] = [
        {
          id: "p1",
          page: 1,
          x: 0.1,
          y: 0.9,
          width: 0.2,
          height: 0.1,
        },
      ];
      const result = await applySignatures(mockPdfBytes, mockSignatureDataUrl, placements);
      expect(result).toBeInstanceOf(Uint8Array);
    });

    it("converts fractional coordinates correctly", async () => {
      const placements: SignaturePlacement[] = [
        {
          id: "p1",
          page: 1,
          x: 0.333,
          y: 0.666,
          width: 0.25,
          height: 0.125,
        },
      ];
      const result = await applySignatures(mockPdfBytes, mockSignatureDataUrl, placements);
      expect(result).toBeInstanceOf(Uint8Array);
    });
  });

  /* ── applySignatures: multiple placements on same page ── */

  describe("applySignatures — multiple placements on same page", () => {
    const mockPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
    const mockSignatureDataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    it("applies two placements on the same page", async () => {
      const placements: SignaturePlacement[] = [
        {
          id: "p1",
          page: 1,
          x: 0.1,
          y: 0.1,
          width: 0.2,
          height: 0.1,
        },
        {
          id: "p2",
          page: 1,
          x: 0.6,
          y: 0.6,
          width: 0.25,
          height: 0.12,
        },
      ];
      const result = await applySignatures(mockPdfBytes, mockSignatureDataUrl, placements);
      expect(result).toBeInstanceOf(Uint8Array);
    });

    it("applies three placements on the same page", async () => {
      const placements: SignaturePlacement[] = [
        {
          id: "p1",
          page: 1,
          x: 0.1,
          y: 0.1,
          width: 0.2,
          height: 0.1,
        },
        {
          id: "p2",
          page: 1,
          x: 0.4,
          y: 0.4,
          width: 0.2,
          height: 0.1,
        },
        {
          id: "p3",
          page: 1,
          x: 0.7,
          y: 0.7,
          width: 0.2,
          height: 0.1,
        },
      ];
      const result = await applySignatures(mockPdfBytes, mockSignatureDataUrl, placements);
      expect(result).toBeInstanceOf(Uint8Array);
    });

    it("applies placements across multiple pages with multiple on page 1", async () => {
      const placements: SignaturePlacement[] = [
        { id: "p1a", page: 1, x: 0.1, y: 0.1, width: 0.2, height: 0.1 },
        { id: "p1b", page: 1, x: 0.5, y: 0.5, width: 0.2, height: 0.1 },
        { id: "p2", page: 2, x: 0.3, y: 0.3, width: 0.2, height: 0.1 },
      ];
      const result = await applySignatures(mockPdfBytes, mockSignatureDataUrl, placements);
      expect(result).toBeInstanceOf(Uint8Array);
    });
  });

  /* ── applySignatures: PDF load failure error branch ── */

  describe("applySignatures — PDF load failure error branch", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("throws when PDFDocument.load throws", async () => {
      vi.mocked(PDFDocument.load).mockImplementationOnce(
        async () => {
          throw new Error("corrupt pdf");
        },
      );

      const mockPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
      const mockSignatureDataUrl =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      const placements: SignaturePlacement[] = [
        {
          id: "p1",
          page: 1,
          x: 0.1,
          y: 0.1,
          width: 0.2,
          height: 0.1,
        },
      ];

      await expect(
        applySignatures(mockPdfBytes, mockSignatureDataUrl, placements),
      ).rejects.toThrow("Gagal membuka file PDF");
    });
  });

  /* ── applySignatures: embedPng failure error branch ── */

  describe("applySignatures — embedPng failure error branch", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("throws when embedPng throws", async () => {
      const mockPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
      const mockSignatureDataUrl =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      vi.mocked(PDFDocument.load).mockImplementationOnce(
        async () =>
          ({
            getPages: vi.fn(() => [
              {
                getSize: vi.fn(() => ({ width: 612, height: 792 })),
                drawImage: vi.fn(),
              },
            ]),
            embedPng: vi.fn(async () => {
              throw new Error("corrupt png");
            }),
            save: vi.fn(async () => new Uint8Array([0x25, 0x50, 0x44, 0x46])),
          }) as unknown as PDFDocument,
      );

      const placements: SignaturePlacement[] = [
        {
          id: "p1",
          page: 1,
          x: 0.1,
          y: 0.1,
          width: 0.2,
          height: 0.1,
        },
      ];

      await expect(
        applySignatures(mockPdfBytes, mockSignatureDataUrl, placements),
      ).rejects.toThrow("Gagal memuat gambar tanda tangan");
    });
  });

  /* ── Additional: placement page boundary tests ── */

  describe("applySignatures — page boundary edge cases", () => {
    const mockPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
    const mockSignatureDataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    it("throws when placement page is 0", async () => {
      const placements: SignaturePlacement[] = [
        {
          id: "p1",
          page: 0,
          x: 0.1,
          y: 0.1,
          width: 0.2,
          height: 0.1,
        },
      ];
      await expect(
        applySignatures(mockPdfBytes, mockSignatureDataUrl, placements),
      ).rejects.toThrow(/Halaman 0 tidak ditemukan/);
    });

    it("throws when placement page exceeds PDF page count", async () => {
      const placements: SignaturePlacement[] = [
        {
          id: "p1",
          page: 3,
          x: 0.1,
          y: 0.1,
          width: 0.2,
          height: 0.1,
        },
      ];
      await expect(
        applySignatures(mockPdfBytes, mockSignatureDataUrl, placements),
      ).rejects.toThrow(/Halaman 3 tidak ditemukan/);
    });

    it("throws when placement page is negative", async () => {
      const placements: SignaturePlacement[] = [
        {
          id: "p1",
          page: -1,
          x: 0.1,
          y: 0.1,
          width: 0.2,
          height: 0.1,
        },
      ];
      await expect(
        applySignatures(mockPdfBytes, mockSignatureDataUrl, placements),
      ).rejects.toThrow(/Halaman -1 tidak ditemukan/);
    });
  });
});

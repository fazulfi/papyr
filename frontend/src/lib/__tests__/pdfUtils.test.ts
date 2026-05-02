import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { mergePDFs, splitPDF, getPDFPageCount, rotatePDFAllPages, imagesToPDF } from "../pdfUtils";

// Helper to create a test PDF file
async function createTestPDF(pageCount: number = 1): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    doc.addPage([612, 792]);
  }
  const bytes = await doc.save();
  return new File([bytes], "test.pdf", { type: "application/pdf" });
}

// Helper to create a test image file (1x1 PNG)
function createTestPNG(): File {
  // Minimal valid PNG (1x1 pixel, white)
  const png = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, // 8-bit RGB
    0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, // IDAT chunk
    0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00, // compressed data
    0x00, 0x00, 0x02, 0x00, 0x01, 0xe2, 0x21, 0xbc, // 
    0x33, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, // IEND chunk
    0x44, 0xae, 0x42, 0x60, 0x82,
  ]);
  return new File([png], "test.png", { type: "image/png" });
}

function createTestJPEG(): File {
  // Minimal JPEG (just magic bytes + enough to be "valid" for type checking)
  const jpeg = new Uint8Array([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46,
    0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
    0x00, 0x01, 0x00, 0x00, 0xff, 0xd9,
  ]);
  return new File([jpeg], "test.jpg", { type: "image/jpeg" });
}

describe("getPDFPageCount", () => {
  it("returns correct page count for single page PDF", async () => {
    const file = await createTestPDF(1);
    const count = await getPDFPageCount(file);
    expect(count).toBe(1);
  });

  it("returns correct page count for multi-page PDF", async () => {
    const file = await createTestPDF(5);
    const count = await getPDFPageCount(file);
    expect(count).toBe(5);
  });

  it("throws on invalid file", async () => {
    const file = new File([new Uint8Array([0, 1, 2, 3])], "bad.pdf", { type: "application/pdf" });
    await expect(getPDFPageCount(file)).rejects.toThrow();
  });
});

describe("mergePDFs", () => {
  it("merges two PDFs into one", async () => {
    const pdf1 = await createTestPDF(2);
    const pdf2 = await createTestPDF(3);
    const result = await mergePDFs([pdf1, pdf2]);
    
    // Verify result is valid PDF with 5 pages
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(5);
  });

  it("throws when less than 2 files", async () => {
    const pdf1 = await createTestPDF(1);
    await expect(mergePDFs([pdf1])).rejects.toThrow("Minimal 2 file");
  });

  it("throws on empty array", async () => {
    await expect(mergePDFs([])).rejects.toThrow("Minimal 2 file");
  });
});

describe("splitPDF", () => {
  it("extracts specified pages", async () => {
    const file = await createTestPDF(5);
    const result = await splitPDF(file, [1, 3, 5]);
    
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(3);
  });

  it("throws on empty pages array", async () => {
    const file = await createTestPDF(3);
    await expect(splitPDF(file, [])).rejects.toThrow("Pilih minimal 1 halaman");
  });

  it("throws on out-of-range page", async () => {
    const file = await createTestPDF(3);
    await expect(splitPDF(file, [4])).rejects.toThrow("melebihi total halaman");
  });

  it("throws on page 0", async () => {
    const file = await createTestPDF(3);
    await expect(splitPDF(file, [0])).rejects.toThrow("melebihi total halaman");
  });
});

describe("rotatePDFAllPages", () => {
  it("rotates all pages by 90 degrees", async () => {
    const file = await createTestPDF(2);
    const result = await rotatePDFAllPages(file, 90);
    
    const doc = await PDFDocument.load(result);
    const pages = doc.getPages();
    expect(pages[0].getRotation().angle).toBe(90);
    expect(pages[1].getRotation().angle).toBe(90);
  });

  it("throws on invalid degree", async () => {
    const file = await createTestPDF(1);
    await expect(rotatePDFAllPages(file, 45)).rejects.toThrow("tidak valid");
  });
});

describe("imagesToPDF", () => {
  it("converts PNG to PDF", async () => {
    const png = createTestPNG();
    const result = await imagesToPDF([png]);
    
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(1);
  });

  it("throws on empty array", async () => {
    await expect(imagesToPDF([])).rejects.toThrow("Pilih minimal 1 gambar");
  });

  it("throws on unsupported format", async () => {
    const file = new File([new Uint8Array([0, 1, 2])], "test.bmp", { type: "image/bmp" });
    await expect(imagesToPDF([file])).rejects.toThrow("bukan format");
  });
});

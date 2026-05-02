import { PDFDocument, PageSizes, degrees } from "pdf-lib";

/* ── Rotate Types & Helpers ── */

/**
 * Map of 1-indexed page numbers to degrees to add (90, 180, 270).
 * Example: new Map([[1, 90], [3, 180]]) rotates page 1 by 90° and page 3 by 180°.
 */
export type PageRotationMap = Map<number, number>;

/** Normalize any degree value to 0, 90, 180, or 270. */
const normalizeDegree = (value: number): number => ((value % 360) + 360) % 360;

/**
 * Rotate specific pages of a PDF by the degrees specified in the map.
 *
 * @param file              Source PDF file
 * @param pageRotationMap   Map of 1-indexed page number → degrees to add (90, 180, 270)
 * @returns                 Uint8Array of the rotated PDF
 */
export async function rotatePDF(
  file: File,
  pageRotationMap: PageRotationMap,
): Promise<Uint8Array> {
  if (pageRotationMap.size === 0) {
    throw new Error("Pilih minimal 1 halaman untuk diputar.");
  }

  const buffer = await file.arrayBuffer();

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  } catch {
    throw new Error(
      `Gagal membaca "${file.name}". File mungkin rusak atau terenkripsi.`,
    );
  }

  const pages = doc.getPages();

  for (const [pageNum, addDegree] of pageRotationMap) {
    if (pageNum < 1 || pageNum > pages.length) {
      throw new Error(
        `Halaman ${pageNum} melebihi total halaman dokumen (${pages.length}).`,
      );
    }
    const page = pages[pageNum - 1];
    const current = page.getRotation().angle;
    page.setRotation(degrees(normalizeDegree(current + addDegree)));
  }

  return doc.save();
}

/**
 * Rotate ALL pages of a PDF by the same degree.
 *
 * @param file       Source PDF file
 * @param addDegree  Degrees to add: 90, 180, or 270
 * @returns          Uint8Array of the rotated PDF
 */
export async function rotatePDFAllPages(
  file: File,
  addDegree: number,
): Promise<Uint8Array> {
  if (![90, 180, 270].includes(addDegree)) {
    throw new Error("Derajat rotasi tidak valid. Gunakan 90, 180, atau 270.");
  }

  const buffer = await file.arrayBuffer();

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  } catch {
    throw new Error(
      `Gagal membaca "${file.name}". File mungkin rusak atau terenkripsi.`,
    );
  }

  for (const page of doc.getPages()) {
    const current = page.getRotation().angle;
    page.setRotation(degrees(normalizeDegree(current + addDegree)));
  }

  return doc.save();
}

/**
 * Convert a WebP file to PNG bytes using an offscreen canvas.
 * Required because pdf-lib does not natively support WebP embedding.
 */
async function webpToPng(file: File): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context tidak tersedia.");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await canvas.convertToBlob({ type: "image/png" });
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

/**
 * Convert multiple images (JPG/PNG/WEBP) into a single PDF.
 *
 * Each image becomes one page sized to fit the image dimensions.
 * Runs entirely client-side using pdf-lib.
 *
 * @param files  Array of image Files (JPG, PNG, or WEBP)
 * @returns      Uint8Array of the resulting PDF
 */
export async function imagesToPDF(files: File[]): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error("Pilih minimal 1 gambar untuk dikonversi.");
  }

  const doc = await PDFDocument.create();

  for (const file of files) {
    const type = file.type.toLowerCase();
    let image;

    try {
      if (type === "image/png") {
        const bytes = new Uint8Array(await file.arrayBuffer());
        image = await doc.embedPng(bytes);
      } else if (type === "image/jpeg" || type === "image/jpg") {
        const bytes = new Uint8Array(await file.arrayBuffer());
        image = await doc.embedJpg(bytes);
      } else if (type === "image/webp") {
        // Convert WebP to PNG via canvas, then embed
        const pngBytes = await webpToPng(file);
        image = await doc.embedPng(pngBytes);
      } else {
        throw new Error(
          `"${file.name}" bukan format yang didukung. Hanya JPG, PNG, dan WEBP yang diterima.`,
        );
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("bukan format")) {
        throw err;
      }
      throw new Error(
        `Gagal memproses "${file.name}". File mungkin rusak atau format tidak valid.`,
      );
    }

    // Create a page sized to the image dimensions
    const { width, height } = image.scale(1);
    const page = doc.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });
  }

  return doc.save();
}

/**
 * Load a PDF and return its page count.
 *
 * Runs client-side. Throws with a Bahasa Indonesia message on failure.
 */
export async function getPDFPageCount(file: File): Promise<number> {
  const buffer = await file.arrayBuffer();
  try {
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    return doc.getPageCount();
  } catch {
    throw new Error(
      "File tidak dapat dibaca. Pastikan PDF tidak terlindungi kata sandi.",
    );
  }
}

/**
 * Split a PDF by extracting only the specified pages.
 *
 * @param file   Source PDF file
 * @param pages  1-indexed page numbers to extract (e.g. [1, 2, 5])
 * @returns      Uint8Array of the new PDF containing only the selected pages
 */
export async function splitPDF(
  file: File,
  pages: number[],
): Promise<Uint8Array> {
  if (pages.length === 0) {
    throw new Error("Pilih minimal 1 halaman untuk dipisahkan.");
  }

  const buffer = await file.arrayBuffer();

  let source: PDFDocument;
  try {
    source = await PDFDocument.load(buffer, { ignoreEncryption: true });
  } catch {
    throw new Error(
      `Gagal membaca "${file.name}". File mungkin rusak atau terenkripsi.`,
    );
  }

  const totalPages = source.getPageCount();

  // Validate page indices (1-indexed → 0-indexed)
  for (const p of pages) {
    if (p < 1 || p > totalPages) {
      throw new Error(
        `Halaman ${p} melebihi total halaman dokumen (${totalPages}).`,
      );
    }
  }

  const indices = pages.map((p) => p - 1); // convert to 0-indexed
  const result = await PDFDocument.create();
  const copied = await result.copyPages(source, indices);
  for (const page of copied) {
    result.addPage(page);
  }

  return result.save();
}

/**
 * Merge multiple PDF files into a single PDF.
 *
 * Runs entirely client-side using pdf-lib — no server round-trip.
 * Pages appear in the order of the input array.
 */
export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error("Minimal 2 file PDF untuk digabungkan.");
  }

  const merged = await PDFDocument.create();

  for (const file of files) {
    const buffer = await file.arrayBuffer();

    let source: PDFDocument;
    try {
      source = await PDFDocument.load(buffer, { ignoreEncryption: true });
    } catch {
      throw new Error(`Gagal membaca "${file.name}". File mungkin rusak atau terenkripsi.`);
    }

    const pages = await merged.copyPages(source, source.getPageIndices());
    for (const page of pages) {
      merged.addPage(page);
    }
  }

  return merged.save();
}

/**
 * Trigger a browser download from a Uint8Array.
 *
 * Creates a temporary <a> element, clicks it, then revokes the object URL.
 */
export function downloadPDF(data: Uint8Array, filename: string): void {
  const blob = new Blob([data.slice().buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

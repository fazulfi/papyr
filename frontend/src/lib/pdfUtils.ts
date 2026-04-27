import { PDFDocument } from "pdf-lib";

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

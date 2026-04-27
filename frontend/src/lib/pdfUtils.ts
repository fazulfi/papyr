import { PDFDocument } from "pdf-lib";

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

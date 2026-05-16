/**
 * STEP-F2-027: Apply signature placements to a PDF using pdf-lib.
 *
 * Pure pipeline: Uint8Array (PDF bytes) + base64 PNG + placements[] → Uint8Array (signed PDF).
 * All pdf-lib interaction lives here so it can be unit-tested in node.
 *
 * Reuses:
 *  - extractPngBase64() from logic.ts
 *  - downloadPDF() from lib/pdfUtils.ts
 *  - SignaturePlacement from logic.ts
 *  - Placement coordinate system (0-1 relative, top-left origin) → pdf-lib (bottom-left origin)
 */

import { PDFDocument } from "pdf-lib";
import type { SignaturePlacement } from "./logic";
import { extractPngBase64 } from "./logic";

/**
 * Decode a base64 PNG data URL into a Uint8Array suitable for pdf-lib's embedPng().
 */
export function base64PngToUint8Array(dataUrl: string): Uint8Array {
  const base64 = extractPngBase64(dataUrl);
  if (!base64) {
    throw new Error("Data URL tanda tangan tidak valid. Harap buat ulang tanda tangan.");
  }
  // atob is available in all JS environments (browser + node ≥ 16).
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

/**
 * Apply one or more signature placements onto a PDF document.
 *
 * @param pdfBytes     Raw PDF bytes (e.g., from File.arrayBuffer())
 * @param signatureDataUrl  Base64 PNG data URL of the signature image
 * @param placements   Array of placements (1-indexed page, 0-1 relative coords)
 * @returns            Uint8Array of the signed PDF
 */
export async function applySignatures(
  pdfBytes: Uint8Array,
  signatureDataUrl: string,
  placements: SignaturePlacement[],
): Promise<Uint8Array> {
  if (placements.length === 0) {
    throw new Error("Tidak ada penempatan tanda tangan. Tempatkan minimal 1 tanda tangan.");
  }

  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  } catch {
    throw new Error("Gagal membuka file PDF. File mungkin rusak atau terenkripsi.");
  }

  const pages = pdfDoc.getPages();
  const sigBytes = base64PngToUint8Array(signatureDataUrl);

  // embedPng may throw if the PNG data is corrupt.
  let embeddedImage;
  try {
    embeddedImage = await pdfDoc.embedPng(sigBytes);
  } catch {
    throw new Error("Gagal memuat gambar tanda tangan. Pastikan file PNG/JPG yang digunakan valid.");
  }

  for (const placement of placements) {
    const { page, x, y, width, height } = placement;

    if (page < 1 || page > pages.length) {
      throw new Error(`Halaman ${page} tidak ditemukan dalam PDF (total: ${pages.length}).`);
    }

    const pdfPage = pages[page - 1];
    const { width: pageW, height: pageH } = pdfPage.getSize();

    // Scale signature to fit within the placement bounds while preserving aspect ratio.
    // pdf-lib embedPng returns image dimensions at scale(1).
    const naturalScale = 1;
    const imgW = embeddedImage.width * naturalScale;
    const imgH = embeddedImage.height * naturalScale;

    const targetW = width * pageW;
    const targetH = height * pageH;

    const scaleX = targetW / imgW;
    const scaleY = targetH / imgH;
    const scale = Math.min(scaleX, scaleY);

    const drawW = imgW * scale;
    const drawH = imgH * scale;

    // Convert from top-left relative (0-1) to pdf-lib bottom-left absolute coords.
    const pdfX = x * pageW;
    const pdfY = pageH - (y * pageH) - drawH;

    pdfPage.drawImage(embeddedImage, {
      x: pdfX,
      y: pdfY,
      width: drawW,
      height: drawH,
    });
  }

  return pdfDoc.save();
}
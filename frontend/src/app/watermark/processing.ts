import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import type { WatermarkTextConfig } from "./logic";

interface WatermarkDrawPosition {
  x: number;
  y: number;
  rotationDegrees: number;
}

export function hexToRgbNormalized(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const g = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const b = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  return { r, g, b };
}

export function mapTextWatermarkPosition(
  position: WatermarkTextConfig["position"],
  pageWidth: number,
  pageHeight: number,
): WatermarkDrawPosition {
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;

  switch (position) {
    case "center":
      return { x: centerX, y: centerY, rotationDegrees: 0 };
    case "diagonal":
      return { x: centerX, y: centerY, rotationDegrees: -30 };
    case "top":
      return { x: centerX, y: pageHeight - 50, rotationDegrees: 0 };
    case "bottom":
      return { x: centerX, y: 50, rotationDegrees: 0 };
    default:
      return { x: centerX, y: centerY, rotationDegrees: 0 };
  }
}

export async function applyTextWatermark(
  pdfBytes: Uint8Array,
  config: WatermarkTextConfig,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const { r, g, b } = hexToRgbNormalized(config.color);

  const textWidth = helveticaFont.widthOfTextAtSize(config.text, config.fontSize);
  const textHeight = helveticaFont.heightAtSize(config.fontSize);

  for (const page of pages) {
    const { width, height } = page.getSize();
    const mapped = mapTextWatermarkPosition(config.position, width, height);
    const rotation =
      config.position === "diagonal" ? mapped.rotationDegrees : config.rotation;
    const angleRad = (rotation * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    // pdf-lib draws text with the (x, y) point as the bottom-left baseline anchor
    // and rotates around that anchor. Offset (x, y) so the text's visual center
    // aligns with the mapped position after rotation.
    const x = mapped.x - (cosA * textWidth - sinA * textHeight) / 2;
    const y = mapped.y - (sinA * textWidth + cosA * textHeight) / 2;

    page.drawText(config.text, {
      x,
      y,
      size: config.fontSize,
      font: helveticaFont,
      color: rgb(r, g, b),
      opacity: config.opacity,
      rotate: degrees(rotation),
    });
  }

  return pdfDoc.save();
}

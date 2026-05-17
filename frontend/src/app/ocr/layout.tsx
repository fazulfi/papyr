import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OCR PDF — Jadikan PDF Scan Bisa Dicari - Papyr",
  description:
    "Jadikan file PDF gambar atau scan memiliki text layer yang bisa dicari dan diseleksi. Hasil tetap dalam format PDF. Gratis, tanpa registrasi.",
  openGraph: {
    title: "OCR PDF — Jadikan PDF Scan Bisa Dicari - Papyr",
    description:
      "Jadikan file PDF gambar atau scan memiliki text layer yang bisa dicari dan diseleksi. Hasil tetap dalam format PDF. Gratis, tanpa registrasi.",
    url: "https://mypapyr.com/ocr",
    images: ["/og/ocr.png"],
  },
};

export default function OcrLayout({ children }: { children: React.ReactNode }) {
  return children;
}

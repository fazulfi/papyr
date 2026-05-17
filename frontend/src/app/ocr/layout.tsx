import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OCR PDF — Konversi Gambar ke Teks (DOCX) - Papyr",
  description:
    "Ekstrak teks dari file PDF gambar atau scan menggunakan OCR. Hasil dalam format Word (.docx). Gratis, tanpa registrasi.",
  openGraph: {
    title: "OCR PDF — Konversi Gambar ke Teks (DOCX) - Papyr",
    description:
      "Ekstrak teks dari file PDF gambar atau scan menggunakan OCR. Hasil dalam format Word (.docx). Gratis, tanpa registrasi.",
    url: "https://mypapyr.com/ocr",
    images: ["/og/ocr.png"],
  },
};

export default function OcrLayout({ children }: { children: React.ReactNode }) {
  return children;
}
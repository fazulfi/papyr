import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konversi PDF ke Excel (XLSX) - Papyr",
  description: "Ekstrak tabel dari file PDF dan konversi ke format Excel (.xlsx). 100% gratis, tanpa registrasi.",
  openGraph: {
    title: "Konversi PDF ke Excel (XLSX) - Papyr",
    description: "Ekstrak tabel dari file PDF dan konversi ke format Excel (.xlsx). 100% gratis, tanpa registrasi.",
    url: "https://mypapyr.com/pdf-to-excel",
    images: ["/og/pdf-to-excel.png"],
  },
};

export default function PdfToExcelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
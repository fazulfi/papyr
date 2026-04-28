import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ubah PDF ke Gambar Online Gratis",
  description:
    "Ubah halaman PDF menjadi gambar PNG berkualitas tinggi. Konversi slide presentasi atau sertifikat jadi gambar untuk di-share di media sosial.",
};

export default function PdfToImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

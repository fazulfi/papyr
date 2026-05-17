import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tambah Watermark PDF - Papyr',
  description:
    'Tambahkan watermark teks atau gambar ke semua halaman PDF. Preview sebelum apply. Gratis, tanpa login.',
  openGraph: {
    title: 'Tambah Watermark PDF - Papyr',
    description:
      'Tambahkan watermark teks atau gambar ke semua halaman PDF. Preview sebelum apply. Gratis.',
    url: 'https://mypapyr.com/watermark',
    images: ['/og/watermark.png'],
  },
};

export default function WatermarkLayout({ children }: { children: React.ReactNode }) {
  return children;
}

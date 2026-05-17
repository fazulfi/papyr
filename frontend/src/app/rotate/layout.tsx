import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Putar PDF — Rotate Halaman PDF Online Gratis',
  description:
    'Putar halaman PDF sesuai kebutuhan. Perbaiki orientasi dokumen scan, foto, atau halaman yang terbalik. Gratis, tanpa akun, langsung di browser.',
};

export default function RotateLayout({ children }: { children: React.ReactNode }) {
  return children;
}

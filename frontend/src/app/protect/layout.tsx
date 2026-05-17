import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proteksi PDF dengan Password - Papyr',
  description:
    'Lindungi file PDF Anda dengan password AES-256. Gratis, cepat, tanpa login. File dihapus otomatis dalam 60 menit.',
  openGraph: {
    title: 'Proteksi PDF dengan Password - Papyr',
    description: 'Lindungi file PDF Anda dengan password AES-256. Gratis, cepat, tanpa login.',
    url: 'https://mypapyr.com/protect',
    images: ['/og/protect.png'],
  },
};

export default function ProtectLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hapus Password PDF - Papyr',
  description:
    'Buka kunci PDF yang terproteksi password. Masukkan password, download PDF tanpa proteksi. Gratis dan privasi terjaga.',
  openGraph: {
    title: 'Hapus Password PDF - Papyr',
    description: 'Buka kunci PDF yang terproteksi password. Gratis dan privasi terjaga.',
    url: 'https://mypapyr.com/unlock',
    images: ['/og/unlock.png'],
  },
};

export default function UnlockLayout({ children }: { children: React.ReactNode }) {
  return children;
}

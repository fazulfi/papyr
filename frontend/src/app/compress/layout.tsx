import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kompres PDF Online Gratis',
  description:
    'Perkecil ukuran file PDF tanpa mengurangi kualitas. Cocok untuk kirim dokumen lewat WhatsApp, email kantor, atau upload ke portal pemerintah.',
};

export default function CompressLayout({ children }: { children: React.ReactNode }) {
  return children;
}

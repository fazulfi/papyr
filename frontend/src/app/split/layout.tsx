import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pisahkan PDF Online Gratis',
  description:
    'Ambil halaman tertentu dari dokumen PDF. Pisahkan halaman dari laporan, skripsi, atau e-book tanpa perlu download ulang seluruh file.',
};

export default function SplitLayout({ children }: { children: React.ReactNode }) {
  return children;
}

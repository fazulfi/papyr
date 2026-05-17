import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ubah Gambar ke PDF Online Gratis',
  description:
    'Ubah foto atau gambar menjadi file PDF. Jadikan foto KTP, bukti transfer, atau hasil scan jadi PDF rapi untuk dikirim lewat email.',
};

export default function ImageToPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}

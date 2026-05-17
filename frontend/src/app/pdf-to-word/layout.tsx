import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Konversi PDF ke Word (DOCX) - Papyr',
  description:
    'Ubah file PDF menjadi dokumen Word (.docx) dengan cepat dan akurat. 100% gratis, tanpa registrasi.',
  openGraph: {
    title: 'Konversi PDF ke Word (DOCX) - Papyr',
    description:
      'Ubah file PDF menjadi dokumen Word (.docx) dengan cepat dan akurat. 100% gratis, tanpa registrasi.',
    url: 'https://mypapyr.com/pdf-to-word',
    images: ['/og/pdf-to-word.png'],
  },
};

export default function PdfToWordLayout({ children }: { children: React.ReactNode }) {
  return children;
}

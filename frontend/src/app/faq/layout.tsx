import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Pertanyaan Umum',
  description:
    'Jawaban untuk pertanyaan yang sering ditanyakan tentang Papyr — alat PDF gratis untuk Indonesia. Keamanan file, batas upload, format yang didukung.',
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}

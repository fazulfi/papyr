'use client';

import { useState } from 'react';

/* ── Inline SVG Icons ── */

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function HelpCircleIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/* ── FAQ Data ── */

const FAQ_ITEMS = [
  {
    question: 'Apakah file saya aman?',
    answer:
      'Ya, keamanan file-mu adalah prioritas kami. Semua transfer menggunakan HTTPS (terenkripsi). File yang di-upload ke server disimpan di Cloudflare R2 dengan akses terbatas, dan otomatis dihapus dalam 1 jam. Untuk fitur yang diproses di browser (Gabungkan PDF, Pisahkan PDF), file-mu tidak pernah meninggalkan perangkatmu.',
  },
  {
    question: 'Berapa lama file disimpan di server?',
    answer:
      'Maksimal 1 jam. Setelah itu, file dihapus otomatis dari server kami — tanpa pengecualian. Link download juga kedaluwarsa setelah 1 jam. Untuk fitur yang diproses di browser, file tidak pernah di-upload ke server sama sekali.',
  },
  {
    question: 'Apakah perlu daftar akun?',
    answer:
      'Tidak. Papyr bisa langsung dipakai tanpa daftar, tanpa login, tanpa email. Buka website, pilih alat, selesai. Kami tidak mengumpulkan data pribadi apapun.',
  },
  {
    question: 'Berapa ukuran file maksimum?',
    answer:
      'Saat ini batas upload adalah 20 MB per file. Untuk fitur yang diproses di browser (Gabungkan PDF, Pisahkan PDF), batasnya lebih fleksibel karena tidak perlu upload ke server.',
  },
  {
    question: 'Bisa dipakai di HP?',
    answer:
      'Ya! Papyr dioptimalkan untuk mobile. Semua fitur bisa diakses dari browser HP tanpa perlu install aplikasi. Cukup buka mypapyr.com dari Chrome, Safari, atau browser lainnya.',
  },
  {
    question: 'Apakah Papyr gratis?',
    answer:
      'Ya, semua fitur dasar Papyr gratis — kompres PDF, gabungkan PDF, pisahkan PDF, gambar ke PDF, dan PDF ke gambar. Tidak ada biaya tersembunyi untuk penggunaan normal.',
  },
  {
    question: 'Format file apa yang didukung?',
    answer:
      'Papyr mendukung file PDF, JPG, dan PNG. Kamu bisa mengompres PDF, menggabungkan beberapa PDF, memisahkan halaman PDF, mengubah gambar (JPG/PNG) menjadi PDF, dan mengubah halaman PDF menjadi gambar PNG.',
  },
  {
    question: 'Bagaimana cara menghubungi Papyr?',
    answer:
      'Kamu bisa menghubungi kami melalui email di privacy@mypapyr.com. Kami akan merespons secepat mungkin.',
  },
];

/* ── Accordion Item ── */

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-sm">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-[15px] font-semibold text-navy">{question}</span>
        <ChevronDownIcon open={isOpen} />
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-[15px] leading-relaxed text-slate-600">{answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ── FAQ Page ── */

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        <HelpCircleIcon />
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Pertanyaan Umum</h1>
      </div>
      <p className="mt-3 text-[15px] text-slate-500">
        Jawaban untuk pertanyaan yang sering ditanyakan tentang Papyr.
      </p>

      {/* Accordion */}
      <div className="mt-8 space-y-3">
        {FAQ_ITEMS.map((item, index) => (
          <AccordionItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-xl bg-slate-50 p-6 text-center">
        <p className="text-[15px] text-slate-600">Masih punya pertanyaan?</p>
        <a
          href="mailto:privacy@mypapyr.com"
          className="mt-2 inline-block text-[15px] font-medium text-accent underline underline-offset-2 hover:text-navy"
        >
          Hubungi kami di privacy@mypapyr.com
        </a>
      </div>
    </div>
  );
}

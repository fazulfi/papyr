import Link from 'next/link';

/* ── Inline SVG Icons ── */

function ArrowRightIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

/* ── Tool Icons ── */

function CompressIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14h6v6M14 4h6v6M14 20h6v-6M4 4h6v6" />
      <path d="M10 14L4 20M20 4l-6 6" />
    </svg>
  );
}

function MergeIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6H5a2 2 0 00-2 2v8a2 2 0 002 2h3M16 6h3a2 2 0 012 2v8a2 2 0 01-2 2h-3" />
      <path d="M12 3v18M9 9l3-3 3 3M9 15l3 3 3-3" />
    </svg>
  );
}

function SplitIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="16" y1="3" x2="16" y2="21" />
      <line x1="16" y1="12" x2="22" y2="6" />
      <line x1="16" y1="12" x2="22" y2="18" />
      <path d="M8 21H4a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    </svg>
  );
}

function ImgToPdfIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function PdfToImgIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h8M8 17h4" />
    </svg>
  );
}

function RotateToolIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  );
}

/* ── Tools Data ── */

const TOOLS = [
  {
    id: 'compress',
    href: '/compress',
    icon: <CompressIcon />,
    name: 'Kompres PDF',
    desc: 'Perkecil ukuran file tanpa mengurangi kualitas.',
  },
  {
    id: 'merge',
    href: '/merge',
    icon: <MergeIcon />,
    name: 'Gabungkan PDF',
    desc: 'Satukan beberapa PDF menjadi satu file.',
  },
  {
    id: 'split',
    href: '/split',
    icon: <SplitIcon />,
    name: 'Pisahkan PDF',
    desc: 'Ambil halaman tertentu atau bagi menjadi bagian.',
  },
  {
    id: 'img-to-pdf',
    href: '/image-to-pdf',
    icon: <ImgToPdfIcon />,
    name: 'Gambar ke PDF',
    desc: 'Ubah JPG, PNG, atau WEBP menjadi PDF.',
  },
  {
    id: 'pdf-to-img',
    href: '/pdf-to-image',
    icon: <PdfToImgIcon />,
    name: 'PDF ke Gambar',
    desc: 'Ekspor setiap halaman sebagai gambar resolusi tinggi.',
  },
  {
    id: 'rotate',
    href: '/rotate',
    icon: <RotateToolIcon />,
    name: 'Putar PDF',
    desc: 'Putar halaman PDF sesuai kebutuhan orientasi.',
  },
];

/* ── Privacy Items ── */

const PRIVACY_ITEMS = [
  {
    icon: <ShieldIcon />,
    title: 'Transfer aman',
    desc: 'File ditransmisikan melalui HTTPS dan diproses secara aman.',
  },
  {
    icon: <ClockIcon />,
    title: 'Dihapus dalam 1 jam',
    desc: 'Setiap file yang diunggah dihapus permanen dalam 60 menit, tanpa pengecualian.',
  },
  {
    icon: <LockIcon />,
    title: 'Tanpa penyimpanan',
    desc: 'Kami tidak pernah membaca, menganalisis, atau menyimpan dokumenmu. Selamanya.',
  },
];

/* ── Trust Badges ── */

const TRUST_BADGES = [
  { icon: <CheckIcon />, text: 'Tanpa akun' },
  { icon: <ClockIcon />, text: 'Auto-hapus 1 jam' },
  { icon: <MobileIcon />, text: 'Bisa di HP' },
];

/* ── Landing Page ── */

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1200px] px-6 pb-20 pt-24 text-center">
        {/* Pill badge */}
        <div className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 pl-2">
          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-xs font-medium tracking-wide text-accent">
            Gratis · Tanpa akun · Auto-hapus
          </span>
        </div>

        <h1 className="mb-5 text-[clamp(40px,6vw,72px)] font-semibold leading-[1.08] tracking-[-2px] text-navy">
          Alat PDF yang
          <br />
          <span className="text-accent">langsung bekerja.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-[520px] text-lg leading-relaxed text-slate-500">
          Kompres, gabungkan, pisahkan, dan konversi PDF dalam hitungan detik.
          <br />
          Tanpa daftar akun. File dihapus dalam 1 jam.
        </p>

        {/* Primary CTA */}
        <Link
          href="/compress"
          className="mb-8 inline-flex items-center gap-2 rounded-[10px] bg-navy px-8 py-3.5 text-base font-semibold tracking-tight text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Mulai gratis <ArrowRightIcon size={18} />
        </Link>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {TRUST_BADGES.map((b) => (
            <div
              key={b.text}
              className="flex items-center gap-1.5 text-[13.5px] font-medium text-slate-500"
            >
              <span className="text-accent">{b.icon}</span>
              {b.text}
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1200px] border-t border-slate-200" />

      {/* ── Tools Grid ── */}
      <section className="mx-auto max-w-[1200px] px-6 py-20">
        <div className="mb-12">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-accent">
            Semua alat
          </p>
          <h2 className="text-[32px] font-semibold tracking-tight text-navy">
            Semua yang kamu butuhkan untuk PDF
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group flex flex-col gap-3 rounded-[10px] border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-[0_4px_20px_rgba(37,99,235,0.1)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-slate-100 text-slate-500 transition-colors group-hover:bg-accent/15 group-hover:text-accent">
                {tool.icon}
              </div>
              <div>
                <div className="mb-1 text-[15px] font-semibold text-navy">{tool.name}</div>
                <div className="text-[13.5px] leading-snug text-slate-500">{tool.desc}</div>
              </div>
              <div className="mt-auto flex items-center gap-1 text-[13px] font-medium text-slate-400 transition-colors group-hover:text-accent">
                Gunakan alat <ArrowRightIcon size={13} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Privacy Section ── */}
      <section className="border-y border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-[1200px] px-6 py-[72px]">
          <div className="mb-12 text-center">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-accent">
              Privasi utama
            </p>
            <h2 className="text-[28px] font-semibold tracking-tight text-navy">
              File kamu tetap milikmu
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {PRIVACY_ITEMS.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent/15 text-accent">
                  {item.icon}
                </div>
                <div>
                  <h3 className="mb-1 text-[15px] font-semibold text-navy">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

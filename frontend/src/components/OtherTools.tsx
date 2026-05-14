import Link from "next/link";

/* ── Inline SVG Icons ── */

function ArrowRightIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ── Tools Data ── */

const ALL_TOOLS = [
  { href: "/compress", name: "Kompres PDF" },
  { href: "/merge", name: "Gabungkan PDF" },
  { href: "/split", name: "Pisahkan PDF" },
  { href: "/rotate", name: "Putar PDF" },
  { href: "/image-to-pdf", name: "Gambar ke PDF" },
  { href: "/pdf-to-image", name: "PDF ke Gambar" },
  { href: "/protect", name: "Proteksi PDF" },
  { href: "/unlock", name: "Hapus Password PDF" },
];

/* ── Component ── */

interface OtherToolsProps {
  currentTool: string;
}

export default function OtherTools({ currentTool }: OtherToolsProps) {
  const otherTools = ALL_TOOLS.filter((t) => t.href !== currentTool);

  return (
    <div className="mt-16 w-full border-t border-slate-200 pb-8 pt-8">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">
        Alat lainnya
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {otherTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-navy transition-colors hover:border-accent/50 hover:text-accent"
          >
            {tool.name}
            <ArrowRightIcon />
          </Link>
        ))}
      </div>
    </div>
  );
}

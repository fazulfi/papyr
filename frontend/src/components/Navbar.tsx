"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Inline SVG Icons ── */

function FileIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Nav Links Data ── */

const NAV_LINKS = [
  { href: "/compress", label: "Kompres" },
  { href: "/merge", label: "Gabungkan" },
  { href: "/split", label: "Pisahkan" },
  { href: "/rotate", label: "Putar" },
  { href: "/image-to-pdf", label: "Gambar ke PDF" },
  { href: "/pdf-to-image", label: "PDF ke Gambar" },
  { href: "/protect", label: "Proteksi" },
  { href: "/unlock", label: "Unlock" },
  { href: "/watermark", label: "Watermark" },
  { href: "/sign", label: "Tanda Tangan" },
  { href: "/pdf-to-word", label: "PDF ke Word" },
  { href: "/pdf-to-excel", label: "PDF ke Excel" },
  { href: "/ocr", label: "OCR" },
];

/* ── Navbar Component ── */

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-bg/92 backdrop-blur-md">
      <div className="mx-auto flex h-[52px] max-w-[1440px] items-center gap-4 px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setMobileOpen(false)}>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-navy">
            <FileIcon />
          </div>
          <span className="text-[17px] font-semibold tracking-tight text-navy">Papyr</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium transition-colors lg:px-2.5 lg:text-sm ${
                pathname === link.href
                  ? "text-accent"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          href="/compress"
          className="hidden shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:inline-flex"
        >
          Coba Gratis
        </Link>

        {/* Mobile: CTA + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/compress"
            className="rounded-lg bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white"
            onClick={() => setMobileOpen(false)}
          >
            Coba Gratis
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-slate-600"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-accent/10 text-accent"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

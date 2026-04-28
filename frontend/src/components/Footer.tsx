"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

/* ── Inline SVG Icons ── */

function FileIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ── Language Switcher ── */

function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
      >
        <GlobeIcon />
        🇮🇩 Indonesia
        <ChevronDownIcon />
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-accent">
            🇮🇩 Indonesia
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="flex items-center justify-between px-3 py-2 text-sm text-slate-400">
            🇬🇧 English
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              Segera hadir
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Footer Links ── */

const FOOTER_LINKS = [
  { href: "#", label: "Privasi" },
  { href: "#", label: "Syarat" },
  { href: "#", label: "Kontak" },
  { href: "#", label: "Blog" },
];

/* ── Footer Component ── */

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-bg">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-6 py-10">
        {/* Logo + copyright */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-navy">
              <FileIcon />
            </div>
            <span className="text-[15px] font-semibold text-navy">Papyr</span>
          </Link>
          <span className="ml-3 text-[13px] text-slate-300">© 2026</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-5">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium text-slate-500 transition-colors hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language switcher */}
        <LanguageSwitcher />
      </div>
    </footer>
  );
}

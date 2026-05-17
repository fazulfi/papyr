'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';

/* ── Types ── */

interface PageRangeInputProps {
  totalPages: number;
  onChange: (pages: number[], raw: string) => void;
}

interface ParseResult {
  pages: number[];
  error: string | null;
}

/* ── Parser ── */

function parsePageRange(input: string, totalPages: number): ParseResult {
  const trimmed = input.trim();

  if (trimmed === '') {
    return { pages: [], error: null };
  }

  // Only allow digits, hyphens, commas, and spaces
  if (!/^[\d\s,\-]+$/.test(trimmed)) {
    return {
      pages: [],
      error: 'Gunakan angka, tanda hubung, dan koma saja.',
    };
  }

  const parts = trimmed
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const pages = new Set<number>();

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr, ...rest] = part.split('-');
      if (rest.length > 0 || !startStr || !endStr) {
        return { pages: [], error: `Rentang tidak valid: "${part}".` };
      }

      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (isNaN(start) || isNaN(end)) {
        return { pages: [], error: `Rentang tidak valid: "${part}".` };
      }

      if (start > end) {
        return {
          pages: [],
          error: 'Rentang tidak valid: angka awal harus lebih kecil dari angka akhir.',
        };
      }

      if (start < 1 || end > totalPages) {
        const outOfBounds = start < 1 ? start : end;
        return {
          pages: [],
          error: `Halaman ${outOfBounds} melebihi total halaman dokumen (${totalPages}).`,
        };
      }

      for (let i = start; i <= end; i++) {
        pages.add(i);
      }
    } else {
      const num = parseInt(part, 10);
      if (isNaN(num)) {
        return { pages: [], error: `"${part}" bukan nomor halaman yang valid.` };
      }
      if (num < 1 || num > totalPages) {
        return {
          pages: [],
          error: `Halaman ${num} melebihi total halaman dokumen (${totalPages}).`,
        };
      }
      pages.add(num);
    }
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  return { pages: sorted, error: null };
}

/* ── Component ── */

export default function PageRangeInput({ totalPages, onChange }: PageRangeInputProps) {
  const [raw, setRaw] = useState('');

  const result = useMemo(() => parsePageRange(raw, totalPages), [raw, totalPages]);

  useEffect(() => {
    onChange(result.pages, raw);
  }, [result.pages, raw, onChange]);

  const handleQuickSelect = useCallback((value: string) => {
    setRaw(value);
  }, []);

  return (
    <div>
      {/* Input */}
      <label htmlFor="page-range" className="mb-1.5 block text-sm font-medium text-navy">
        Halaman yang diambil
      </label>
      <input
        id="page-range"
        type="text"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="Contoh: 1-3, 5, 7-10"
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy outline-none transition-colors placeholder:text-slate-300 ${
          result.error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
            : 'border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent/20'
        }`}
      />
      <p className="mt-1.5 text-xs text-slate-400">
        Masukkan nomor halaman atau rentang (1-3, 5, 7)
      </p>

      {/* Error */}
      {result.error && <p className="mt-2 text-xs font-medium text-rose-500">{result.error}</p>}

      {/* Live preview */}
      {!result.error && result.pages.length > 0 && (
        <p className="mt-2 text-xs text-accent">
          Halaman yang dipilih: {result.pages.join(', ')} ({result.pages.length} halaman)
        </p>
      )}

      {/* Quick select buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleQuickSelect('1')}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-accent hover:text-accent"
        >
          Halaman Pertama
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect(String(totalPages))}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-accent hover:text-accent"
        >
          Halaman Terakhir
        </button>
        <button
          type="button"
          onClick={() => handleQuickSelect(`1-${totalPages}`)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-accent hover:text-accent"
        >
          Semua Halaman
        </button>
      </div>
    </div>
  );
}

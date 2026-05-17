'use client';

/**
 * PrivacyNotice — Reusable privacy notice component for all tool pages.
 * Shows shield icon + contextual privacy message.
 * Always visible regardless of tool state.
 */

function ShieldIcon() {
  return (
    <svg
      width={16}
      height={16}
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

type ProcessingModel = 'server' | 'client' | 'hybrid';

const MESSAGES: Record<ProcessingModel, string> = {
  server: 'File kamu otomatis dihapus setelah 1 jam. Kami tidak pernah menyimpan dokumenmu.',
  client: 'File tidak pernah meninggalkan perangkatmu. Semua proses berjalan di browser.',
  hybrid:
    'File kecil diproses di browser. File besar dikirim ke server dan otomatis dihapus dalam 1 jam.',
};

export default function PrivacyNotice({ model }: { model: ProcessingModel }) {
  return (
    <div className="mt-6 flex items-start justify-center rounded-xl bg-slate-50 p-4 text-sm text-slate-500 border border-slate-100">
      <span className="mt-0.5 text-slate-400 mr-2 shrink-0">
        <ShieldIcon />
      </span>
      <p>{MESSAGES[model]}</p>
    </div>
  );
}

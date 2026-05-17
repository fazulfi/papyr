'use client';

import { useMemo, useState } from 'react';

interface PasswordInputProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  showConfirm?: boolean;
  minLength?: number;
}

export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong';

export function calculatePasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export function getPasswordStrengthLevel(score: number): PasswordStrengthLevel {
  if (score >= 3) return 'strong';
  if (score === 2) return 'medium';
  return 'weak';
}

function EyeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function StrengthBar({ level }: { level: PasswordStrengthLevel }) {
  const activeCount = level === 'strong' ? 3 : level === 'medium' ? 2 : 1;

  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-3 gap-1.5" aria-label="Password strength indicator">
        {[1, 2, 3].map((idx) => {
          const active = idx <= activeCount;
          const colorClass =
            level === 'strong'
              ? 'bg-green-500'
              : level === 'medium'
                ? 'bg-amber-500'
                : 'bg-red-500';
          return (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-colors ${active ? colorClass : 'bg-slate-200'}`}
            />
          );
        })}
      </div>
      <p className="text-xs text-slate-500">
        Kekuatan password: {level === 'strong' ? 'Kuat' : level === 'medium' ? 'Sedang' : 'Lemah'}
      </p>
    </div>
  );
}

export default function PasswordInput({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmChange,
  showConfirm = true,
  minLength = 4,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const strengthLevel = useMemo(() => {
    const score = calculatePasswordStrength(password);
    return getPasswordStrengthLevel(score);
  }, [password]);

  const tooShort = password.length > 0 && password.length < minLength;
  const mismatch =
    showConfirm &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  return (
    <div className="space-y-3 rounded-xl bg-white p-4 border border-slate-100 shadow-sm">
      <label className="text-sm font-medium text-navy">Password</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder={`Masukkan password (min ${minLength} karakter)`}
          className={`w-full rounded-lg border bg-slate-50 px-4 py-3 pr-10 text-sm text-navy placeholder:text-slate-400 focus:outline-none ${
            tooShort
              ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
              : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
          }`}
          aria-label="Password"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {password.length > 0 && <StrengthBar level={strengthLevel} />}
      {tooShort && <p className="mt-2 text-xs font-medium text-rose-500">Minimal 4 karakter</p>}

      {showConfirm && (
        <>
          <label className="text-sm font-medium text-navy">Konfirmasi Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => onConfirmChange(e.target.value)}
              placeholder="Konfirmasi password"
              className={`w-full rounded-lg border bg-slate-50 px-4 py-3 pr-10 text-sm text-navy placeholder:text-slate-400 focus:outline-none ${
                mismatch
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
              }`}
              aria-label="Konfirmasi password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={
                showConfirmPassword
                  ? 'Sembunyikan konfirmasi password'
                  : 'Tampilkan konfirmasi password'
              }
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {mismatch && (
            <p className="mt-2 text-xs font-medium text-rose-500">Password tidak cocok</p>
          )}
        </>
      )}
    </div>
  );
}

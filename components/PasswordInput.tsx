'use client';

import { useState } from 'react';

export default function PasswordInput({
  value,
  onChange,
  required,
  minLength,
  className,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  className?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        required={required}
        minLength={minLength}
        value={value}
        onChange={onChange}
        className={className ?? 'w-full border border-ink/20 px-3 py-2 pr-10 mt-1 text-sm bg-transparent outline-none focus:border-ink'}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        className="absolute right-2 top-1/2 mt-0.5 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
      >
        {show ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3l18 18" strokeLinecap="round" />
            <path d="M10.58 10.58a2 2 0 002.83 2.83" strokeLinecap="round" />
            <path d="M9.36 5.11A9.99 9.99 0 0112 5c5 0 9 4 10 7-.32.99-1 2.24-2.02 3.4M6.6 6.6C4.4 8 2.9 9.9 2 12c1 3 5 7 10 7 1.35 0 2.62-.28 3.75-.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

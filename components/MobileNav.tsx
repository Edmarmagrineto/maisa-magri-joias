'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-label="Abrir menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
      >
        <span className="block h-px w-5 bg-ink" />
        <span className="block h-px w-5 bg-ink" />
        <span className="block h-px w-5 bg-ink" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-cream">
          <div className="flex justify-end p-6">
            <button aria-label="Fechar menu" onClick={() => setOpen(false)} className="text-2xl">
              ×
            </button>
          </div>
          <nav className="flex flex-col items-center gap-6 pt-8 text-lg font-serif">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/entrar" onClick={() => setOpen(false)}>
              Entrar
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}

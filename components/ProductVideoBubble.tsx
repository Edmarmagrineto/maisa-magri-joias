'use client';

import { useState } from 'react';

export default function ProductVideoBubble({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ver vídeo de ${alt}`}
        className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden border-2 border-ink/70 focus:outline-none focus:ring-2 focus:ring-ink/40"
      >
        <video
          src={src}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            aria-label="Fechar vídeo"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 text-3xl text-cream leading-none"
          >
            ×
          </button>
          <video
            src={src}
            className="max-h-full max-w-full"
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

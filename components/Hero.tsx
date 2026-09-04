import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden bg-ink">
      <Image
        src="/products/hero-brinco.jpeg"
        alt="Semijoias Maisa Magri"
        fill
        priority
        quality={92}
        className="object-cover opacity-80"
        style={{ objectPosition: 'center 40%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 px-6 text-center text-cream">
        <p className="text-xs uppercase tracking-widest2 mb-1">Maisa Magri · Desde 2003</p>
        <p className="text-xs uppercase tracking-widest2 mb-4">Semijoias / Prata 925</p>
        <h1 className="font-serif text-4xl sm:text-6xl max-w-2xl leading-tight">
          Brilho que acompanha cada momento
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/produtos"
            className="bg-cream text-ink px-8 py-3 text-xs uppercase tracking-widest2 hover:bg-white transition-colors"
          >
            Ver catálogo
          </Link>
          <Link
            href="/sobre"
            className="border border-cream/60 px-8 py-3 text-xs uppercase tracking-widest2 hover:bg-cream/10 transition-colors"
          >
            Como funciona
          </Link>
        </div>
      </div>
    </section>
  );
}

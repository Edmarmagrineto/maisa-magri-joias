import Link from 'next/link';
import PaymentMethods from '@/components/PaymentMethods';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl tracking-widest2 mb-3">MAISA MAGRI</p>
          <p className="text-sm text-cream/70 leading-relaxed">
            Semijoias selecionadas para durar. Peças banhadas com acabamento fino,
            pensadas para o dia a dia e para ocasiões especiais.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-cream/50 mb-4">Contato</p>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>
              <a
                href="https://wa.me/5517997451727"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                WhatsApp: (17) 99745-1727
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/maisamagri"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Instagram: @maisamagri
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-cream/50 mb-4">Formas de pagamento</p>
          <div className="text-cream [&_li]:border-cream/20 [&_li]:bg-transparent">
            <PaymentMethods compact />
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-cream/50 mb-4">Ajuda</p>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link href="/sobre" className="hover:underline">Como funciona</Link></li>
            <li><Link href="/produtos" className="hover:underline">Catálogo</Link></li>
            <li><Link href="/entrar" className="hover:underline">Entrar / Criar conta</Link></li>
            <li><Link href="/conta" className="hover:underline">Meus pedidos</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-[11px] text-cream/50">
        © {new Date().getFullYear()} Maisa Magri Semijoias — todos os direitos reservados.
      </div>
    </footer>
  );
}

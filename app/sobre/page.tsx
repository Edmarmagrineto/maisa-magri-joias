import Link from 'next/link';
import HowItWorks from '@/components/HowItWorks';
import PaymentMethods from '@/components/PaymentMethods';

const FAQ = [
  {
    q: 'Preciso criar conta para comprar?',
    a: 'Sim. A conta é gratuita e leva menos de um minuto — com ela você acompanha seus pedidos e pode avaliar as peças que comprar.',
  },
  {
    q: 'Como sei quanto vou pagar de frete?',
    a: 'Na página de cada peça e no checkout você informa seu CEP e vê na hora o valor estimado e o prazo de entrega.',
  },
  {
    q: 'Quais formas de pagamento vocês aceitam?',
    a: 'Pix, cartão de crédito (em até 6x sem juros), cartão de débito e boleto bancário.',
  },
  {
    q: 'Posso avaliar uma peça depois de receber?',
    a: 'Sim! Basta acessar a página da peça, logada na sua conta, e deixar sua nota e comentário.',
  },
];

export default function SobrePage() {
  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 text-center">
        <p className="text-xs uppercase tracking-widest2 text-ink/50">Guia rápido</p>
        <h1 className="font-serif text-4xl mt-2">Como funciona o site</h1>
        <p className="text-ink/60 mt-4 leading-relaxed">
          Preparamos a Maisa Magri para ser simples do primeiro clique até a peça chegar na
          sua casa. Veja abaixo o passo a passo.
        </p>
      </div>

      <HowItWorks />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-20">
        <p className="text-xs uppercase tracking-widest2 text-ink/50 mb-4 text-center">
          Formas de pagamento aceitas
        </p>
        <PaymentMethods />
      </div>

      <div className="bg-sand/60 py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-serif text-3xl text-center mb-10">Perguntas frequentes</h2>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <div key={item.q} className="border-b border-ink/10 pb-6">
                <p className="font-serif text-lg mb-2">{item.q}</p>
                <p className="text-sm text-ink/70 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/produtos"
              className="inline-block bg-ink text-cream px-8 py-3 text-xs uppercase tracking-widest2"
            >
              Começar a comprar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

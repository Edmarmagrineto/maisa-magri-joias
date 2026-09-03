const STEPS = [
  {
    n: '01',
    title: 'Escolha suas peças',
    text: 'Navegue pelo catálogo, veja fotos, preço e descrição de cada semijoia e adicione ao carrinho.',
  },
  {
    n: '02',
    title: 'Crie sua conta',
    text: 'Cadastre-se com e-mail e senha para acompanhar seus pedidos e deixar avaliações.',
  },
  {
    n: '03',
    title: 'Frete e pagamento',
    text: 'Informe seu CEP para calcular o frete e escolha entre Pix, cartão ou boleto no checkout.',
  },
  {
    n: '04',
    title: 'Receba em casa',
    text: 'Acompanhe o status do pedido na sua área de cliente até a peça chegar até você.',
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-widest2 text-ink/50">Simples do início ao fim</p>
        <h2 className="font-serif text-3xl sm:text-4xl mt-2">Como funciona</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {STEPS.map((step) => (
          <div key={step.n} className="text-center sm:text-left">
            <p className="font-serif text-4xl text-ink/20 mb-3">{step.n}</p>
            <h3 className="font-serif text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-ink/60 leading-relaxed">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

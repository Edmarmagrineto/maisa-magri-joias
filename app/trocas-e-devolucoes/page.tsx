export default function TrocasEDevolucoesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <p className="text-xs uppercase tracking-widest2 text-ink/50">Legal</p>
      <h1 className="font-serif text-3xl mt-2 mb-2">Política de Trocas e Devoluções</h1>
      <p className="text-xs text-ink/40 mb-10">Última atualização: setembro de 2026</p>

      <div className="space-y-8 text-sm text-ink/70 leading-relaxed">
        <section>
          <h2 className="font-serif text-lg text-ink mb-2">1. Direito de arrependimento (7 dias)</h2>
          <p>
            Conforme o artigo 49 do Código de Defesa do Consumidor, por se tratar de uma compra
            feita fora de estabelecimento físico, você tem até <strong>7 dias corridos</strong> após
            o recebimento do produto para desistir da compra, sem precisar justificar o motivo e
            sem nenhum custo.
          </p>
          <p className="mt-2">
            Nesse caso, devolvemos o valor total pago, incluindo o frete, assim que recebermos a
            peça de volta em nossa loja, em até 30 dias úteis, no mesmo meio de pagamento usado na
            compra (Pix, cartão ou boleto).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">2. Peça com defeito ou avaria</h2>
          <p>
            Se a peça chegar com defeito de fabricação ou dano de transporte, você tem até{' '}
            <strong>90 dias corridos</strong> a partir do recebimento para solicitar troca ou
            reembolso, sem nenhum custo adicional. Pedimos que, sempre que possível, fotografe o
            problema para agilizar o atendimento.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">3. Condições para aceitar a devolução</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>A peça deve estar sem sinais de uso;</li>
            <li>Sempre que possível, na embalagem original, junto com nota/comprovante do pedido;</li>
            <li>Peças com nítido sinal de uso ou dano causado após o recebimento não serão aceitas em devolução por arrependimento (a devolução por defeito de fábrica não é afetada por isso).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">4. Como solicitar</h2>
          <p>
            Entre em contato pelo WhatsApp{' '}
            <a href="https://wa.me/5517997451727" className="underline hover:no-underline">
              (17) 99745-1727
            </a>{' '}
            ou pelo e-mail{' '}
            <a href="mailto:pedidosmaisamagri@gmail.com" className="underline hover:no-underline">
              pedidosmaisamagri@gmail.com
            </a>{' '}
            informando o número do pedido (disponível em &quot;Minha conta&quot;) e o motivo da
            troca ou devolução. Vamos te orientar sobre como enviar a peça de volta.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">5. Custo do frete de devolução</h2>
          <p>
            Em caso de arrependimento (sem defeito), o custo do frete de volta é por conta da
            cliente. Em caso de defeito de fabricação ou erro nosso no envio, o frete de devolução
            corre por nossa conta.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">6. Pedidos retirados na loja</h2>
          <p>
            Se você optou por retirar o pedido pessoalmente, as mesmas regras acima se aplicam — a
            troca ou devolução pode ser feita presencialmente ou combinando o envio pelos nossos
            canais de contato.
          </p>
        </section>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function TermosDeUsoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <p className="text-xs uppercase tracking-widest2 text-ink/50">Legal</p>
      <h1 className="font-serif text-3xl mt-2 mb-2">Termos de Uso</h1>
      <p className="text-xs text-ink/40 mb-10">Última atualização: setembro de 2026</p>

      <div className="space-y-8 text-sm text-ink/70 leading-relaxed">
        <section>
          <h2 className="font-serif text-lg text-ink mb-2">1. Aceitação dos termos</h2>
          <p>
            Ao acessar e usar o site maisamagri.com.br (&quot;site&quot;), operado pela Maisa Magri
            Semijoias, você concorda com estes Termos de Uso e com a nossa{' '}
            <Link href="/politica-de-privacidade" className="underline hover:no-underline">
              Política de Privacidade
            </Link>
            . Se você não concordar com algum ponto, pedimos que não utilize o site.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">2. Cadastro e conta</h2>
          <p>
            Para comprar é necessário criar uma conta, informando nome, e-mail, telefone e CPF
            verdadeiros. Você é responsável por manter a confidencialidade da sua senha e por todas
            as atividades realizadas na sua conta.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">3. Produtos e preços</h2>
          <p>
            Todas as peças são semijoias (folheadas ou banhadas) e prata 925, conforme indicado em
            cada produto. Fazemos o possível para que fotos e descrições reflitam fielmente as
            peças, mas pequenas variações de tom, brilho ou acabamento podem ocorrer entre a foto e
            a peça real, por se tratar de itens artesanais ou de produção em pequena escala.
          </p>
          <p className="mt-2">
            Os preços exibidos no site estão em reais (R$) e podem ser alterados sem aviso prévio,
            mas o valor cobrado será sempre o exibido no momento da confirmação do pedido. O
            estoque exibido é atualizado em tempo real; em caso raro de indisponibilidade após a
            compra, entraremos em contato para reembolso ou troca.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">4. Pagamento</h2>
          <p>
            Os pagamentos são processados pelo Mercado Pago (Pix, cartão de crédito, cartão de
            débito ou boleto bancário). O pedido só é confirmado após a aprovação do pagamento pelo
            Mercado Pago.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">5. Entrega e retirada</h2>
          <p>
            O frete é calculado em tempo real conforme o CEP informado. Alternativamente, você pode
            optar por retirar o pedido pessoalmente no nosso endereço, sem custo de frete, conforme
            indicado no checkout. Os prazos de entrega exibidos são estimativas fornecidas pela
            transportadora e podem variar por motivos fora do nosso controle.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">6. Trocas e devoluções</h2>
          <p>
            Consulte nossa{' '}
            <Link href="/trocas-e-devolucoes" className="underline hover:no-underline">
              Política de Trocas e Devoluções
            </Link>{' '}
            para prazos e condições.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">7. Avaliações</h2>
          <p>
            Clientes que compraram uma peça podem deixar nota e comentário sobre ela. Reservamo-nos
            o direito de remover avaliações com conteúdo ofensivo, falso ou que não se relacione ao
            produto.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">8. Propriedade intelectual</h2>
          <p>
            As fotos, textos, logotipo e identidade visual do site pertencem à Maisa Magri
            Semijoias e não podem ser copiados ou reutilizados sem autorização.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">9. Limitação de responsabilidade</h2>
          <p>
            Não nos responsabilizamos por atrasos causados por transportadoras, greves, fenômenos
            climáticos ou outros eventos fora do nosso controle. Nossa responsabilidade se limita
            ao valor pago pelo pedido.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">10. Lei aplicável</h2>
          <p>
            Estes termos são regidos pelas leis brasileiras, incluindo o Código de Defesa do
            Consumidor (Lei nº 8.078/1990) e o Marco Civil da Internet (Lei nº 12.965/2014). Fica
            eleito o foro do domicílio do consumidor para dirimir eventuais controvérsias.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">11. Contato</h2>
          <p>
            Dúvidas sobre estes termos? Fale conosco pelo WhatsApp{' '}
            <a href="https://wa.me/5517997451727" className="underline hover:no-underline">
              (17) 99745-1727
            </a>{' '}
            ou pelo e-mail{' '}
            <a href="mailto:pedidosmaisamagri@gmail.com" className="underline hover:no-underline">
              pedidosmaisamagri@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

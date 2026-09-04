export default function PoliticaDePrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <p className="text-xs uppercase tracking-widest2 text-ink/50">Legal</p>
      <h1 className="font-serif text-3xl mt-2 mb-2">Política de Privacidade</h1>
      <p className="text-xs text-ink/40 mb-10">Última atualização: setembro de 2026</p>

      <div className="space-y-8 text-sm text-ink/70 leading-relaxed">
        <section>
          <h2 className="font-serif text-lg text-ink mb-2">1. Quem somos</h2>
          <p>
            A Maisa Magri Semijoias (&quot;nós&quot;) opera a loja online maisamagri.com.br. Esta
            política explica quais dados pessoais coletamos de você (&quot;cliente&quot;) ao usar o
            site, para que servem e quais são os seus direitos, em conformidade com a Lei Geral de
            Proteção de Dados (LGPD — Lei nº 13.709/2018).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">2. Quais dados coletamos</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nome completo, e-mail, telefone e CPF, informados no cadastro da conta;</li>
            <li>Endereço e CEP, informados no checkout para cálculo de frete e entrega;</li>
            <li>Histórico de pedidos, itens comprados e valores pagos;</li>
            <li>Avaliações e comentários que você deixar sobre as peças;</li>
            <li>
              Dados técnicos básicos de navegação (como cookies de sessão, necessários para manter
              você logada na sua conta).
            </li>
          </ul>
          <p className="mt-2">
            Não coletamos dados de cartão de crédito, senha do Pix ou qualquer dado financeiro — o
            pagamento é processado inteiramente pelo Mercado Pago, que tem sua própria política de
            privacidade.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">3. Para que usamos seus dados</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Processar e entregar seus pedidos;</li>
            <li>Calcular o frete real até o seu endereço;</li>
            <li>Enviar e-mails de confirmação de pedido e atualização de status;</li>
            <li>Permitir que você acompanhe seus pedidos na área &quot;Minha conta&quot;;</li>
            <li>Cumprir obrigações fiscais e legais;</li>
            <li>Prevenir fraudes e proteger a segurança da loja.</li>
          </ul>
          <p className="mt-2">Não usamos seus dados para envio de publicidade por terceiros nem os vendemos a ninguém.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">4. Com quem compartilhamos</h2>
          <p>Compartilhamos apenas os dados estritamente necessários com prestadores de serviço que nos ajudam a operar a loja:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Mercado Pago</strong> — processamento de pagamentos (Pix, cartão, boleto);</li>
            <li><strong>Melhor Envio / Correios</strong> — cálculo e realização do frete;</li>
            <li><strong>Supabase</strong> — armazenamento seguro do banco de dados e autenticação de conta;</li>
            <li><strong>Resend</strong> — envio dos e-mails transacionais de confirmação de pedido;</li>
            <li><strong>Vercel</strong> — hospedagem do site.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">5. Por quanto tempo guardamos seus dados</h2>
          <p>
            Mantemos os dados da sua conta e pedidos enquanto sua conta estiver ativa, e pelo prazo
            exigido pela legislação fiscal e civil brasileira após uma compra (geralmente até 5
            anos), mesmo que você exclua sua conta, para fins de comprovação legal.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">6. Seus direitos</h2>
          <p>De acordo com a LGPD, você pode a qualquer momento solicitar:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Confirmação de que tratamos seus dados;</li>
            <li>Acesso, correção ou atualização dos seus dados;</li>
            <li>Exclusão dos seus dados (respeitado o prazo legal de guarda de registros fiscais);</li>
            <li>Informação sobre com quem compartilhamos seus dados.</li>
          </ul>
          <p className="mt-2">
            Para exercer qualquer um desses direitos, entre em contato pelo WhatsApp{' '}
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

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">7. Segurança</h2>
          <p>
            Sua senha nunca fica visível para nós — ela é armazenada de forma criptografada pelo
            Supabase. O site usa conexão segura (HTTPS) em todas as páginas, e os dados de pagamento
            trafegam diretamente pelo ambiente seguro do Mercado Pago, sem passar pelos nossos
            servidores.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-lg text-ink mb-2">8. Alterações desta política</h2>
          <p>
            Podemos atualizar esta política periodicamente para refletir mudanças no site ou na
            legislação. A data da última atualização está sempre indicada no topo desta página.
          </p>
        </section>
      </div>
    </div>
  );
}

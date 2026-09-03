const METHODS = [
  { name: 'Pix', detail: '5% de desconto à vista' },
  { name: 'Cartão de crédito', detail: 'em até 6x sem juros' },
  { name: 'Cartão de débito', detail: 'aprovação imediata' },
  { name: 'Boleto bancário', detail: 'compensação em até 2 dias úteis' },
];

export default function PaymentMethods({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={compact ? 'grid grid-cols-2 gap-3 text-xs' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
      {METHODS.map((m) => (
        <li
          key={m.name}
          className={
            compact
              ? 'border border-ink/15 px-3 py-2'
              : 'border border-ink/15 px-4 py-3 bg-white/40'
          }
        >
          <p className="font-medium">{m.name}</p>
          <p className="text-ink/60 text-[11px] mt-0.5">{m.detail}</p>
        </li>
      ))}
    </ul>
  );
}

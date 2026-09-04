'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUS_OPTIONS = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'pago', label: 'Pago' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
];

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        setError('Não foi possível atualizar.');
        return;
      }

      router.refresh();
    } catch {
      setError('Não foi possível atualizar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleChange}
        disabled={saving}
        className="border border-ink/20 bg-transparent px-2 py-1 text-xs uppercase tracking-widest2 outline-none focus:border-ink disabled:opacity-50"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[11px] text-red-700">{error}</span>}
    </div>
  );
}

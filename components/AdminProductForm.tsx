'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/types';

const CATEGORIES = ['Brincos', 'Colares', 'Pulseiras', 'Anéis'];

export default function AdminProductForm({ product }: { product?: Product }) {
  const supabase = createClient();
  const router = useRouter();
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name ?? '');
  const [category, setCategory] = useState(product?.category ?? CATEGORIES[0]);
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [stock, setStock] = useState(product?.stock?.toString() ?? '10');
  const [description, setDescription] = useState(product?.description ?? '');
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(product?.image_url ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    let finalImageUrl = imageUrl;

    if (file) {
      const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setError('Não foi possível enviar a foto. Tente novamente.');
        setSaving(false);
        return;
      }

      const { data: publicUrl } = supabase.storage.from('product-images').getPublicUrl(path);
      finalImageUrl = publicUrl.publicUrl;
    }

    const payload = {
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      description: description || null,
      image_url: finalImageUrl || null,
    };

    const { error: saveError } = isEditing
      ? await supabase.from('products').update(payload).eq('id', product!.id)
      : await supabase.from('products').insert(payload);

    setSaving(false);

    if (saveError) {
      setError('Não foi possível salvar a peça. Verifique os campos e tente novamente.');
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm(`Remover "${product.name}" do catálogo?`)) return;
    setSaving(true);
    await supabase.from('products').delete().eq('id', product.id);
    router.push('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 sm:grid-cols-[220px_1fr]">
      <div>
        <div className="relative aspect-[4/5] bg-sand mb-3">
          {preview && <Image src={preview} alt="Pré-visualização" fill className="object-cover" />}
        </div>
        <input type="file" accept="image/*" onChange={handleFileChange} className="text-xs" />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest2 text-ink/50">Nome da peça</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-ink/20 px-3 py-2 mt-1 text-sm bg-transparent outline-none focus:border-ink"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest2 text-ink/50">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-ink/20 px-3 py-2 mt-1 text-sm bg-transparent outline-none focus:border-ink"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest2 text-ink/50">Estoque</label>
            <input
              type="number"
              min={0}
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border border-ink/20 px-3 py-2 mt-1 text-sm bg-transparent outline-none focus:border-ink"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest2 text-ink/50">Preço (R$)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-ink/20 px-3 py-2 mt-1 text-sm bg-transparent outline-none focus:border-ink"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest2 text-ink/50">Descrição</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-ink/20 px-3 py-2 mt-1 text-sm bg-transparent outline-none focus:border-ink"
          />
        </div>

        {error && <p className="text-xs text-red-700">{error}</p>}

        <div className="flex items-center gap-4 pt-2">
          <button
            disabled={saving}
            className="bg-ink text-cream px-6 py-3 text-xs uppercase tracking-widest2 hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar peça'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="text-xs uppercase tracking-widest2 text-red-700 hover:underline"
            >
              Remover peça
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

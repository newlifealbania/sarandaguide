'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase/client';

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ListingForm({ categories, listing, userId, redirectTo }) {
  const router = useRouter();
  const isEdit = Boolean(listing);
  const [form, setForm] = useState({
    name: listing?.name || '',
    category_id: listing?.category_id || '',
    description: listing?.description || '',
    address: listing?.address || '',
    phone: listing?.phone || '',
    website: listing?.website || '',
    email: listing?.email || '',
    price_range: listing?.price_range || '€€',
    opening_hours: listing?.opening_hours || ''
  });
  const [images, setImages] = useState(listing?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function uploadImages(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    const supabase = createClient();
    const urls = [];
    for (const file of files) {
      const path = `${userId}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ''))}.${file.name.split('.').pop()}`;
      const { error: err } = await supabase.storage.from('listing-images').upload(path, file);
      if (err) {
        setError(err.message);
        break;
      }
      const { data } = supabase.storage.from('listing-images').getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    setImages([...images, ...urls].slice(0, 10));
    setUploading(false);
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const supabase = createClient();

    const payload = {
      ...form,
      category_id: form.category_id || null,
      images,
      owner_id: userId,
      claimed: true,
      updated_at: new Date().toISOString()
    };

    let result;
    if (isEdit) {
      result = await supabase.from('listings').update(payload).eq('id', listing.id).select().single();
    } else {
      payload.slug = `${slugify(form.name)}-${Math.random().toString(36).slice(2, 6)}`;
      payload.status = 'pending';
      result = await supabase.from('listings').insert(payload).select().single();
    }

    setSaving(false);
    if (result.error) setError(result.error.message);
    else {
      router.push(redirectTo ? redirectTo.replace('{id}', result.data.id) : '/dashboard');
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-6">
      <div>
        <label className="label">Business name *</label>
        <input value={form.name} onChange={set('name')} className="input" required />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label">Category *</label>
          <select value={form.category_id} onChange={set('category_id')} className="input" required>
            <option value="">Choose a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Price range</label>
          <select value={form.price_range} onChange={set('price_range')} className="input">
            <option>€</option>
            <option>€€</option>
            <option>€€€</option>
            <option>€€€€</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">Description *</label>
        <textarea value={form.description} onChange={set('description')} rows={5} className="input" required />
      </div>
      <div>
        <label className="label">Address</label>
        <input value={form.address} onChange={set('address')} className="input" placeholder="Street, Saranda, Albania" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label">Phone</label>
          <input value={form.phone} onChange={set('phone')} className="input" placeholder="+355 …" />
        </div>
        <div>
          <label className="label">Website</label>
          <input value={form.website} onChange={set('website')} className="input" placeholder="https://…" />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label">Public email</label>
          <input type="email" value={form.email} onChange={set('email')} className="input" />
        </div>
        <div>
          <label className="label">Opening hours</label>
          <input value={form.opening_hours} onChange={set('opening_hours')} className="input" placeholder="Mon–Sun 09:00–23:00" />
        </div>
      </div>

      <div>
        <label className="label">Photos (up to 10)</label>
        <input type="file" accept="image/*" multiple onChange={uploadImages} className="text-sm" />
        {uploading && <p className="mt-1 text-xs text-slate-500">Uploading…</p>}
        {images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {images.map((src, i) => (
              <div key={src} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-20 w-20 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={saving || uploading} className="btn-primary w-full">
        {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Continue'}
      </button>
      {!isEdit && (
        <p className="text-center text-xs text-slate-400">
          Next step: choose your plan. Your listing goes live after approval.
        </p>
      )}
    </form>
  );
}

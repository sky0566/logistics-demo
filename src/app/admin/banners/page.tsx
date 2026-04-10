'use client';

import { useEffect, useState, useCallback } from 'react';
import ImagePicker from '@/components/ImagePicker';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  sort_order: number;
  is_active: number;
}

const emptyForm = { title: '', subtitle: '', image: '', link: '', sort_order: 0, is_active: 1 };

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => fetch('/api/banners').then((r) => r.json()).then(setBanners), []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.image) return alert('Image is required');
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/banners/${editing.id}` : '/api/banners';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    load();
  };

  const handleEdit = (b: Banner) => {
    setEditing(b);
    setForm({ title: b.title, subtitle: b.subtitle, image: b.image, link: b.link, sort_order: b.sort_order, is_active: b.is_active });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this banner?')) return;
    await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    load();
  };

  const toggleActive = async (b: Banner) => {
    await fetch(`/api/banners/${b.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...b, is_active: b.is_active ? 0 : 1 }),
    });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
        <button
          onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Banner
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Banner' : 'New Banner'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <ImagePicker label="Banner Image *" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
              <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="/services" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" checked={form.is_active === 1} onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} className="w-4 h-4" />
              <label className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
          {form.image && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
              <div className="h-40 bg-cover bg-center rounded-lg border" style={{ backgroundImage: `url(${form.image})` }} />
            </div>
          )}
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors">
              {editing ? 'Update' : 'Create'}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            No banners yet. Add your first banner above.
          </div>
        ) : (
          banners.map((b) => (
            <div key={b.id} className={`bg-white rounded-xl shadow-sm overflow-hidden ${!b.is_active ? 'opacity-60' : ''}`}>
              <div className="h-40 bg-cover bg-center bg-gray-100" style={{ backgroundImage: `url(${b.image})` }} />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{b.title || 'Untitled'}</h3>
                    <p className="text-sm text-gray-600 mt-1">{b.subtitle || 'No subtitle'}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {b.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Sort: {b.sort_order} {b.link && `· Link: ${b.link}`}</p>
                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <button onClick={() => handleEdit(b)} className="text-primary hover:text-primary-dark text-sm font-medium">Edit</button>
                  <button onClick={() => toggleActive(b)} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                    {b.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-700 text-sm font-medium ml-auto">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import ImagePicker from '@/components/ImagePicker';

interface Partner {
  id: number;
  name: string;
  logo: string;
  website: string;
  sort_order: number;
  is_active: number;
}

const emptyForm = { name: '', logo: '', website: '', sort_order: 0, is_active: 1 };

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => fetch('/api/partners').then((r) => r.json()).then(setPartners), []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.name) return alert('Name is required');
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/partners/${editing.id}` : '/api/partners';
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

  const handleEdit = (p: Partner) => {
    setEditing(p);
    setForm({ name: p.name, logo: p.logo || '', website: p.website || '', sort_order: p.sort_order, is_active: p.is_active });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this partner?')) return;
    await fetch(`/api/partners/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
        <button
          onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Partner
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Partner' : 'New Partner'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. COSCO, MSK" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="https://..." />
            </div>
            <div>
              <ImagePicker label="Logo" value={form.logo} onChange={(v) => setForm({ ...form, logo: v })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
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

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Logo</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Website</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No partners yet</td></tr>
            ) : (
              partners.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    {p.logo ? (
                      <img src={p.logo} alt={p.name} className="w-10 h-10 object-contain rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">N/A</div>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{p.website ? <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{p.website}</a> : '-'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{p.sort_order}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="text-primary hover:text-primary-dark text-sm font-medium">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

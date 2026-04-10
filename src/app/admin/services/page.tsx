'use client';

import { useEffect, useState, useCallback } from 'react';
import { slugify } from '@/lib/utils';
import RichEditor from '@/components/RichEditor';
import ImagePicker from '@/components/ImagePicker';

interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  content: string;
  features: string;
  icon: string;
  image: string;
  sort_order: number;
  is_active: number;
}

interface ServiceItem {
  id: number;
  service_id: number;
  name: string;
  description: string;
  image: string;
  sort_order: number;
}

const emptyForm = { name: '', slug: '', description: '', content: '', features: '[]', icon: '', image: '', sort_order: 0, is_active: 1 };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [subItemsService, setSubItemsService] = useState<Service | null>(null);

  const load = useCallback(() => fetch('/api/services').then((r) => r.json()).then(setServices), []);
  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/services/${editing.id}` : '/api/services';
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

  const handleEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.name, slug: s.slug, description: s.description, content: s.content, features: s.features || '[]', icon: s.icon, image: s.image, sort_order: s.sort_order, is_active: s.is_active });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <button
          onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Service
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Service' : 'New Service'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <ImagePicker label="Image" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                checked={form.is_active === 1}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <div className="mt-4">
            <RichEditor
              label="Content"
              value={form.content}
              onChange={(v) => setForm({ ...form, content: v })}
              height={300}
            />
          </div>
          <FeaturesEditor value={form.features} onChange={(v) => setForm({ ...form, features: v })} />
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
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Icon</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No services yet</td></tr>
            ) : (
              services.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-3 text-xl">{s.icon || '📦'}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{s.slug}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{s.sort_order}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(s)} className="text-primary hover:text-primary-dark text-sm font-medium">Edit</button>
                      <button onClick={() => setSubItemsService(s)} className="text-gray-500 hover:text-gray-700 text-sm font-medium">Sub-items</button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sub-items Panel */}
      {subItemsService && (
        <SubItemsEditor service={subItemsService} onClose={() => setSubItemsService(null)} />
      )}
    </div>
  );
}

function SubItemsEditor({ service, onClose }: { service: Service; onClose: () => void }) {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [form, setForm] = useState({ name: '', description: '', image: '', sort_order: 0 });
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/service-items?service_id=${service.id}`).then(r => r.json()).then(setItems);
  }, [service.id]);
  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form.name) return;
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/service-items/${editingItem.id}` : '/api/service-items';
    const body = editingItem ? form : { ...form, service_id: service.id };
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowForm(false);
    setEditingItem(null);
    setForm({ name: '', description: '', image: '', sort_order: 0 });
    load();
  };

  const handleEdit = (item: ServiceItem) => {
    setEditingItem(item);
    setForm({ name: item.name, description: item.description, image: item.image, sort_order: item.sort_order });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this sub-item?')) return;
    await fetch(`/api/service-items/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Sub-items: <span className="text-primary">{service.name}</span>
        </h2>
        <div className="flex gap-2">
          <button onClick={() => { setEditingItem(null); setForm({ name: '', description: '', image: '', sort_order: 0 }); setShowForm(true); }}
            className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg text-sm font-medium">+ Add</button>
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">Close</button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">Sub-categories within this service (e.g. General Cargo, Reefer Shipments, Buyers Consolidation)</p>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. General Cargo" />
            </div>
            <div>
              <ImagePicker label="Image" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-lg text-sm font-medium">
              {editingItem ? 'Update' : 'Add'}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium">Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No sub-items yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
              {item.image ? (
                <div className="h-28 bg-cover bg-center bg-gray-100" style={{ backgroundImage: `url(${item.image})` }} />
              ) : (
                <div className="h-28 bg-gray-100 flex items-center justify-center text-gray-300 text-xs">No image</div>
              )}
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                {item.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(item)} className="text-primary text-xs font-medium">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 text-xs font-medium">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FeaturesEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  let items: string[] = [];
  try { items = JSON.parse(value); } catch { items = []; }

  const update = (newItems: string[]) => onChange(JSON.stringify(newItems));
  const add = () => update([...items, '']);
  const remove = (i: number) => update(items.filter((_, idx) => idx !== i));
  const set = (i: number, val: string) => { const next = [...items]; next[i] = val; update(next); };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">Features (bullet points)</label>
        <button type="button" onClick={add} className="text-primary hover:text-primary-dark text-sm font-medium">+ Add</button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No features. Click &quot;+ Add&quot; to start.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <input
                type="text"
                value={item}
                onChange={(e) => set(i, e.target.value)}
                placeholder="Feature text"
                className="flex-1 px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 p-1" title="Remove">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

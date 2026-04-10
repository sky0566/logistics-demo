'use client';

import { useEffect, useState } from 'react';
import { slugify } from '@/lib/utils';
import RichEditor from '@/components/RichEditor';
import ImagePicker from '@/components/ImagePicker';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  is_active: number;
  created_at: string;
}

const emptyForm = { title: '', slug: '', content: '', excerpt: '', image: '', category: 'company', is_active: 1 };

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch('/api/news').then((r) => r.json()).then(setNews);

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/news/${editing.id}` : '/api/news';
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

  const handleEdit = (item: NewsItem) => {
    setEditing(item);
    setForm({ title: item.title, slug: item.slug, content: item.content, excerpt: item.excerpt, image: item.image, category: item.category, is_active: item.is_active });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this news article?')) return;
    await fetch(`/api/news/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
        <button
          onClick={() => { setEditing(null); setForm(emptyForm); setShowForm(true); }}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Article
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Article' : 'New Article'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="company">Company</option>
                <option value="industry">Industry</option>
                <option value="logistics">Logistics</option>
                <option value="shipping">Shipping</option>
              </select>
            </div>
            <div>
              <ImagePicker label="Cover Image" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <div className="mt-4">
            <RichEditor
              label="Content"
              value={form.content}
              onChange={(v) => setForm({ ...form, content: v })}
              height={400}
            />
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active === 1}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-700">Published</label>
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
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No articles yet</td></tr>
            ) : (
              news.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-3">
                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{item.category}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.is_active ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)} className="text-primary hover:text-primary-dark text-sm font-medium">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
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

'use client';

import { useEffect, useState, useCallback } from 'react';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  status: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

const STATUSES = [
  { value: 'new', label: 'New', color: 'bg-orange-100 text-orange-700' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-700' },
  { value: 'replied', label: 'Replied', color: 'bg-green-100 text-green-700' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-500' },
];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = useCallback(() => fetch('/api/inquiries').then((r) => r.json()).then(setInquiries), []);
  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (selected?.id === id) setSelected({ ...selected, status });
    load();
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    await fetch(`/api/inquiries/${selected.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_notes: notes }),
    });
    setSelected({ ...selected, admin_notes: notes });
    setSavingNotes(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this inquiry?')) return;
    await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    if (selected?.id === id) setSelected(null);
    load();
  };

  const handleSelect = (inq: Inquiry) => {
    setSelected(inq);
    setNotes(inq.admin_notes || '');
  };

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter);
  const statusInfo = (s: string) => STATUSES.find(st => st.value === s) || STATUSES[0];

  const counts = {
    all: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    processing: inquiries.filter(i => i.status === 'processing').length,
    replied: inquiries.filter(i => i.status === 'replied').length,
    closed: inquiries.filter(i => i.status === 'closed').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <div className="text-sm text-gray-500">{counts.new > 0 && <span className="text-orange-600 font-medium">{counts.new} new</span>} · {counts.all} total</div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-200 rounded-lg p-1 mb-6 max-w-2xl">
        {[{ key: 'all', label: 'All' }, ...STATUSES.map(s => ({ key: s.value, label: s.label }))].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${filter === t.key ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            {t.label} ({counts[t.key as keyof typeof counts] || 0})
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No inquiries</td></tr>
              ) : (
                filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    className={`border-b last:border-0 cursor-pointer transition-colors ${selected?.id === inq.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => handleSelect(inq)}
                  >
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {inq.name}
                      {inq.admin_notes && <span className="ml-1 text-primary" title="Has notes">📝</span>}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{inq.email}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{inq.service || '-'}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusInfo(inq.status).color}`}>
                        {statusInfo(inq.status).label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">{new Date(inq.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Detail */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Inquiry Detail</h2>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Name</span>
                  <p className="text-sm text-gray-900">{selected.name}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Email</span>
                  <p className="text-sm text-gray-900">
                    <a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a>
                  </p>
                </div>
                {selected.phone && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Phone</span>
                    <p className="text-sm text-gray-900">{selected.phone}</p>
                  </div>
                )}
                {selected.company && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Company</span>
                    <p className="text-sm text-gray-900">{selected.company}</p>
                  </div>
                )}
                {selected.service && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Service</span>
                    <p className="text-sm text-gray-900">{selected.service}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Message</span>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selected.message}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Date</span>
                  <p className="text-sm text-gray-900">{new Date(selected.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Status buttons */}
              <div className="mt-5 pt-4 border-t">
                <span className="text-xs font-medium text-gray-500 uppercase block mb-2">Update Status</span>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s.value}
                      onClick={() => updateStatus(selected.id, s.value)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                        selected.status === s.value
                          ? s.color + ' border-transparent'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div className="mt-5 pt-4 border-t">
                <span className="text-xs font-medium text-gray-500 uppercase block mb-2">Admin Notes</span>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes about this inquiry..."
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <button
                  onClick={saveNotes}
                  disabled={savingNotes}
                  className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>

              <div className="mt-5 pt-4 border-t">
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full"
                >
                  Delete Inquiry
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <p>Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

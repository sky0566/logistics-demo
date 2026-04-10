'use client';

import { useEffect, useState } from 'react';

interface LinkItem {
  label: string;
  href: string;
}

interface Settings {
  company_name: string;
  company_name_highlight: string;
  company_description: string;
  contact_address: string;
  contact_phone: string;
  contact_email: string;
  contact_whatsapp: string;
  contact_wechat: string;
  working_hours: string;
  footer_services: string;
  footer_quick_links: string;
  footer_copyright: string;
  footer_bottom_links: string;
}

function safeParseLinks(json: string): LinkItem[] {
  try { return JSON.parse(json); } catch { return []; }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'company' | 'footer' | 'password'>('company');

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwStatus, setPwStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [pwError, setPwError] = useState('');

  // Link editor state
  const [serviceLinks, setServiceLinks] = useState<LinkItem[]>([]);
  const [quickLinks, setQuickLinks] = useState<LinkItem[]>([]);
  const [bottomLinks, setBottomLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then((data: Settings) => {
      setSettings(data);
      setServiceLinks(safeParseLinks(data.footer_services));
      setQuickLinks(safeParseLinks(data.footer_quick_links));
      setBottomLinks(safeParseLinks(data.footer_bottom_links));
    });
  }, []);

  const updateSetting = (key: keyof Settings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaveMsg('');
    const payload = {
      ...settings,
      footer_services: JSON.stringify(serviceLinks),
      footer_quick_links: JSON.stringify(quickLinks),
      footer_bottom_links: JSON.stringify(bottomLinks),
    };
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSaveMsg(res.ok ? 'Settings saved!' : 'Failed to save');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { setPwError('Min 6 characters'); return; }
    setPwStatus('loading');
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      if (!res.ok) { const d = await res.json(); setPwError(d.error); setPwStatus('error'); return; }
      setPwStatus('success');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch { setPwError('Network error'); setPwStatus('error'); }
  };

  if (!settings) return <div className="animate-pulse text-gray-500">Loading settings...</div>;

  const copyrightText = settings.footer_copyright.replace('{year}', new Date().getFullYear().toString());

  const tabs = [
    { key: 'company' as const, label: 'Company Info' },
    { key: 'footer' as const, label: 'Footer Links' },
    { key: 'password' as const, label: 'Password' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        {activeTab !== 'password' && (
          <div className="flex items-center gap-3">
            {saveMsg && <span className={`text-sm font-medium ${saveMsg.includes('saved') ? 'text-green-600' : 'text-red-600'}`}>{saveMsg}</span>}
            <button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-200 rounded-lg p-1 mb-6 max-w-xl">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === t.key ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Company Info */}
      {activeTab === 'company' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (Part 1)</label>
                <input type="text" value={settings.company_name} onChange={e => updateSetting('company_name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
                <p className="text-xs text-gray-400 mt-1">Shows in white/primary color</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (Part 2 - Highlight)</label>
                <input type="text" value={settings.company_name_highlight} onChange={e => updateSetting('company_name_highlight', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
                <p className="text-xs text-gray-400 mt-1">Shows in accent/secondary color</p>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
              <textarea rows={3} value={settings.company_description} onChange={e => updateSetting('company_description', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
              <input type="text" value={settings.footer_copyright} onChange={e => updateSetting('footer_copyright', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
              <p className="text-xs text-gray-400 mt-1">Use {'{year}'} as a placeholder for the current year</p>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Logo Preview</h3>
            <div className="flex items-center gap-3 bg-gray-900 rounded-lg p-4 w-fit">
              <div className="w-10 h-10 bg-[#0f4c81] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <span className="text-xl font-bold text-white">{settings.company_name}</span>
                <span className="text-xl font-bold text-amber-400">{settings.company_name_highlight}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Links */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          {/* Service Links Editor */}
          <LinksEditor title="Footer Services Column" items={serviceLinks} onChange={setServiceLinks} />
          <LinksEditor title="Footer Quick Links Column" items={quickLinks} onChange={setQuickLinks} />
          <LinksEditor title="Footer Bottom Links" items={bottomLinks} onChange={setBottomLinks} />

          {/* Live Footer Preview */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Footer Preview</h3>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <footer className="bg-[#1a1a2e] text-gray-300 text-sm">
                <div className="px-6 py-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-[#0f4c81] rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                          <span className="text-lg font-bold text-white">{settings.company_name}</span>
                          <span className="text-lg font-bold text-amber-400">{settings.company_name_highlight}</span>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed text-gray-400">{settings.company_description}</p>
                    </div>
                    {/* Services */}
                    <div>
                      <h4 className="text-white font-semibold mb-3">Our Services</h4>
                      <ul className="space-y-1.5">
                        {serviceLinks.map((l, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-amber-400 cursor-default">
                            <span className="text-amber-400">›</span> {l.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Quick Links */}
                    <div>
                      <h4 className="text-white font-semibold mb-3">Quick Links</h4>
                      <ul className="space-y-1.5">
                        {quickLinks.map((l, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-amber-400 cursor-default">
                            <span className="text-amber-400">›</span> {l.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Contact */}
                    <div>
                      <h4 className="text-white font-semibold mb-3">Contact Us</h4>
                      <ul className="space-y-2 text-xs text-gray-400">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">📍</span>
                          {settings.contact_address}
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-amber-400">📞</span>
                          {settings.contact_phone}
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-amber-400">✉️</span>
                          {settings.contact_email}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Bottom bar */}
                <div className="border-t border-gray-700/50 px-6 py-3 flex justify-between items-center text-xs text-gray-500">
                  <span>{copyrightText}</span>
                  <div className="flex gap-4">
                    {bottomLinks.map((l, i) => (
                      <span key={i} className="hover:text-amber-400 cursor-default">{l.label}</span>
                    ))}
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      )}

      {/* Password */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {pwError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{pwError}</div>}
            {pwStatus === 'success' && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">Password changed!</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" required value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" required value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input type="password" required value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <button type="submit" disabled={pwStatus === 'loading'}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
              {pwStatus === 'loading' ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* -------- Reusable Link List Editor -------- */
function LinksEditor({ title, items, onChange }: { title: string; items: LinkItem[]; onChange: (v: LinkItem[]) => void }) {
  const add = () => onChange([...items, { label: '', href: '' }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, field: 'label' | 'href', val: string) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };
  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...items];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  };
  const moveDown = (i: number) => {
    if (i >= items.length - 1) return;
    const next = [...items];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onChange(next);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <button onClick={add} className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Link
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No links. Click &quot;Add Link&quot; to start.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveUp(i)} disabled={i === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move up">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </button>
                <button onClick={() => moveDown(i)} disabled={i >= items.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-30" title="Move down">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
              <input type="text" placeholder="Label" value={item.label} onChange={e => update(i, 'label', e.target.value)}
                className="flex-1 px-2.5 py-1.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary" />
              <input type="text" placeholder="/path or URL" value={item.href} onChange={e => update(i, 'href', e.target.value)}
                className="flex-1 px-2.5 py-1.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary" />
              <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 p-1" title="Remove">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

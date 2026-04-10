'use client';

import { useEffect, useState, useCallback } from 'react';

type Tab = 'home' | 'about' | 'contact';

interface SettingsMap { [key: string]: string }

interface StatItem { number: string; label: string }
interface HighlightItem { number: string; label: string }
interface AdvantageItem { icon: string; title: string; desc: string }

function safeJson<T>(json: string, fallback: T): T {
  try { return JSON.parse(json); } catch { return fallback; }
}

export default function AdminPagesPage() {
  const [settings, setSettings] = useState<SettingsMap | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const load = useCallback(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings);
  }, []);
  useEffect(() => { load(); }, [load]);

  const update = (key: string, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaveMsg('');
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaveMsg(res.ok ? 'Saved!' : 'Failed to save');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  if (!settings) return <div className="animate-pulse text-gray-500">Loading...</div>;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'home', label: 'Home Page' },
    { key: 'about', label: 'About Page' },
    { key: 'contact', label: 'Contact Page' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Page Content</h1>
        <div className="flex items-center gap-3">
          {saveMsg && <span className={`text-sm font-medium ${saveMsg === 'Saved!' ? 'text-green-600' : 'text-red-600'}`}>{saveMsg}</span>}
          <button onClick={handleSave} disabled={saving}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-200 rounded-lg p-1 mb-6 max-w-md">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === t.key ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'home' && <HomeEditor settings={settings} update={update} />}
      {activeTab === 'about' && <AboutEditor settings={settings} update={update} />}
      {activeTab === 'contact' && <ContactEditor settings={settings} update={update} />}
    </div>
  );
}

/* ============ HOME PAGE EDITOR ============ */
function HomeEditor({ settings, update }: { settings: SettingsMap; update: (k: string, v: string) => void }) {
  const stats = safeJson<StatItem[]>(settings.home_stats, []);
  const partners = safeJson<string[]>(settings.home_partners, []);
  const highlights = safeJson<HighlightItem[]>(settings.home_about_highlights, []);

  const updateStat = (i: number, field: keyof StatItem, val: string) => {
    const next = [...stats]; next[i] = { ...next[i], [field]: val };
    update('home_stats', JSON.stringify(next));
  };
  const addStat = () => update('home_stats', JSON.stringify([...stats, { number: '', label: '' }]));
  const removeStat = (i: number) => update('home_stats', JSON.stringify(stats.filter((_, idx) => idx !== i)));

  const updateHighlight = (i: number, field: keyof HighlightItem, val: string) => {
    const next = [...highlights]; next[i] = { ...next[i], [field]: val };
    update('home_about_highlights', JSON.stringify(next));
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Statistics Bar</h2>
          <button onClick={addStat} className="text-primary hover:text-primary-dark text-sm font-medium">+ Add Stat</button>
        </div>
        <div className="space-y-3">
          {stats.map((s, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input type="text" value={s.number} onChange={e => updateStat(i, 'number', e.target.value)} placeholder="50+"
                className="w-28 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
              <input type="text" value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="Countries Served"
                className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
              <button onClick={() => removeStat(i)} className="text-red-400 hover:text-red-600 p-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
        {/* Preview */}
        {stats.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Preview</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 rounded-lg p-4">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-extralight text-gray-900 tracking-tight">{s.number || '—'}</div>
                  <div className="text-xs text-gray-400 mt-1 uppercase">{s.label || 'Label'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* About Preview Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">About Preview Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={settings.home_about_title || ''} onChange={e => update('home_about_title', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 1</label>
            <textarea rows={3} value={settings.home_about_text || ''} onChange={e => update('home_about_text', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 2</label>
            <textarea rows={2} value={settings.home_about_text2 || ''} onChange={e => update('home_about_text2', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
              <input type="text" value={settings.home_about_years || ''} onChange={e => update('home_about_years', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="3+" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About Image URL</label>
              <input type="text" value={settings.home_about_image || ''} onChange={e => update('home_about_image', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Highlights (3 key points)</label>
            <div className="space-y-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex gap-3">
                  <input type="text" value={h.number} onChange={e => updateHighlight(i, 'number', e.target.value)} placeholder="01"
                    className="w-20 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
                  <input type="text" value={h.label} onChange={e => updateHighlight(i, 'label', e.target.value)} placeholder="Professional Service"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Preview */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Preview</p>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-blue-600 font-medium mb-2">About Us</p>
                <h3 className="text-xl font-light text-gray-900 leading-tight">{settings.home_about_title || 'Title'}</h3>
                <p className="text-gray-500 text-xs mt-3 leading-relaxed">{settings.home_about_text || 'Paragraph 1...'}</p>
                <p className="text-gray-500 text-xs mt-2 leading-relaxed">{settings.home_about_text2 || 'Paragraph 2...'}</p>
                <div className="flex gap-4 mt-4">
                  {highlights.map((h, i) => (
                    <div key={i}>
                      <div className="text-lg font-light text-blue-600">{h.number || '0' + (i+1)}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{h.label || 'Label'}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                {settings.home_about_image && (
                  <div className="rounded-xl overflow-hidden">
                    <img src={settings.home_about_image} alt="Preview" className="w-full h-32 object-cover" />
                  </div>
                )}
                <div className="absolute -bottom-3 -left-3 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="text-xl font-light">{settings.home_about_years || '3+'}</div>
                  <div className="text-[9px] text-white/70">Years of Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Call to Action Banner</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Title</label>
            <input type="text" value={settings.home_cta_title || ''} onChange={e => update('home_cta_title', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Subtitle</label>
            <input type="text" value={settings.home_cta_text || ''} onChange={e => update('home_cta_text', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        {/* Preview */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Preview</p>
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <h3 className="text-xl font-light text-white tracking-tight">{settings.home_cta_title || 'CTA Title'}</h3>
            <p className="text-white/50 text-sm mt-2">{settings.home_cta_text || 'Subtitle text'}</p>
            <span className="inline-block mt-4 px-6 py-2 bg-white text-gray-900 text-xs font-medium rounded-full">Contact Us</span>
          </div>
        </div>
      </div>

      {/* Partners */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Partners Carousel (Text badges)</h2>
          <button onClick={() => update('home_partners', JSON.stringify([...partners, '']))}
            className="text-primary hover:text-primary-dark text-sm font-medium">+ Add</button>
        </div>
        <p className="text-xs text-gray-400 mb-3">These show as text pills on the homepage. For full partner management with logos, use the Partners page.</p>
        <div className="flex flex-wrap gap-2">
          {partners.map((p, i) => (
            <div key={i} className="flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1.5">
              <input type="text" value={p} onChange={e => { const next = [...partners]; next[i] = e.target.value; update('home_partners', JSON.stringify(next)); }}
                className="bg-transparent border-0 outline-none text-sm w-20" placeholder="MSK" />
              <button onClick={() => update('home_partners', JSON.stringify(partners.filter((_, idx) => idx !== i)))}
                className="text-red-400 hover:text-red-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
        {/* Preview */}
        {partners.filter(Boolean).length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Preview</p>
            <div className="flex flex-wrap justify-center gap-2 bg-gray-50 rounded-lg p-4">
              {partners.filter(Boolean).map((p, i) => (
                <span key={i} className="px-4 py-1.5 bg-white rounded-full text-gray-500 text-xs font-medium shadow-sm">{p}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ ABOUT PAGE EDITOR ============ */
function AboutEditor({ settings, update }: { settings: SettingsMap; update: (k: string, v: string) => void }) {
  const advantages = safeJson<AdvantageItem[]>(settings.about_advantages, []);

  const updateAdv = (i: number, field: keyof AdvantageItem, val: string) => {
    const next = [...advantages]; next[i] = { ...next[i], [field]: val };
    update('about_advantages', JSON.stringify(next));
  };
  const addAdv = () => update('about_advantages', JSON.stringify([...advantages, { icon: '📌', title: '', desc: '' }]));
  const removeAdv = (i: number) => update('about_advantages', JSON.stringify(advantages.filter((_, idx) => idx !== i)));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Title</label>
            <input type="text" value={settings.about_company_title || ''} onChange={e => update('about_company_title', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Description (use blank lines for paragraphs)</label>
            <textarea rows={8} value={settings.about_company_text || ''} onChange={e => update('about_company_text', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none font-mono" />
          </div>
        </div>
        {/* Preview */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Preview</p>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-[10px] tracking-[0.2em] uppercase text-blue-600 font-medium mb-2">Who We Are</p>
            <h3 className="text-xl font-light text-gray-900">{settings.about_company_title || 'Company Title'}</h3>
            <div className="mt-3 space-y-2">
              {(settings.about_company_text || 'Company description...').split('\n\n').filter(Boolean).map((p, i) => (
                <p key={i} className="text-gray-500 text-xs leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mission Statement</h2>
        <textarea rows={4} value={settings.about_mission || ''} onChange={e => update('about_mission', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
        {/* Preview */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Preview</p>
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-medium mb-2">Our Mission</p>
            <p className="text-white/80 text-sm leading-relaxed font-light">{settings.about_mission || 'Mission statement...'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Advantages</h2>
          <button onClick={addAdv} className="text-primary hover:text-primary-dark text-sm font-medium">+ Add</button>
        </div>
        <div className="space-y-4">
          {advantages.map((a, i) => (
            <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-lg p-3">
              <input type="text" value={a.icon} onChange={e => updateAdv(i, 'icon', e.target.value)} placeholder="🏆"
                className="w-14 px-2 py-2 border rounded-lg text-center text-lg outline-none" />
              <div className="flex-1 space-y-2">
                <input type="text" value={a.title} onChange={e => updateAdv(i, 'title', e.target.value)} placeholder="Title"
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
                <textarea rows={2} value={a.desc} onChange={e => updateAdv(i, 'desc', e.target.value)} placeholder="Description"
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
              <button onClick={() => removeAdv(i)} className="text-red-400 hover:text-red-600 p-1 mt-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
        {/* Preview */}
        {advantages.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Preview</p>
            <div className="grid md:grid-cols-3 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {advantages.map((a, i) => (
                <div key={i} className="bg-white p-4">
                  <div className="text-2xl mb-2">{a.icon || '📌'}</div>
                  <h4 className="text-sm font-medium text-gray-900">{a.title || 'Title'}</h4>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">{a.desc || 'Description'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Partners Text</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partners Description 1</label>
            <textarea rows={3} value={settings.about_partners_text || ''} onChange={e => update('about_partners_text', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partners Description 2</label>
            <textarea rows={2} value={settings.about_partners_text2 || ''} onChange={e => update('about_partners_text2', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ CONTACT PAGE EDITOR ============ */
function ContactEditor({ settings, update }: { settings: SettingsMap; update: (k: string, v: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
        <p className="text-sm text-gray-500 mb-4">These values appear on the Contact page, Home page contact section, and Footer.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea rows={2} value={settings.contact_address || ''} onChange={e => update('contact_address', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" value={settings.contact_phone || ''} onChange={e => update('contact_phone', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={settings.contact_email || ''} onChange={e => update('contact_email', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input type="text" value={settings.contact_whatsapp || ''} onChange={e => update('contact_whatsapp', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="+86 139 xxxx xxxx" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WeChat</label>
            <input type="text" value={settings.contact_wechat || ''} onChange={e => update('contact_wechat', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
            <input type="text" value={settings.working_hours || ''} onChange={e => update('working_hours', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        {/* Preview */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Preview — Contact Card</p>
          <div className="bg-gray-50 rounded-lg p-6 max-w-md">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 mt-0.5">📍</span>
                <div><p className="text-xs font-medium text-gray-900">Address</p><p className="text-xs text-gray-500">{settings.contact_address || '—'}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600">📞</span>
                <div><p className="text-xs font-medium text-gray-900">Phone</p><p className="text-xs text-gray-500">{settings.contact_phone || '—'}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600">✉️</span>
                <div><p className="text-xs font-medium text-gray-900">Email</p><p className="text-xs text-gray-500">{settings.contact_email || '—'}</p></div>
              </div>
              {settings.contact_whatsapp && (
                <div className="flex items-start gap-3">
                  <span className="text-green-600">💬</span>
                  <div><p className="text-xs font-medium text-gray-900">WhatsApp</p><p className="text-xs text-gray-500">{settings.contact_whatsapp}</p></div>
                </div>
              )}
              {settings.contact_wechat && (
                <div className="flex items-start gap-3">
                  <span className="text-green-600">🟢</span>
                  <div><p className="text-xs font-medium text-gray-900">WeChat</p><p className="text-xs text-gray-500">{settings.contact_wechat}</p></div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <span className="text-blue-600">🕐</span>
                <div><p className="text-xs font-medium text-gray-900">Working Hours</p><p className="text-xs text-gray-500">{settings.working_hours || '—'}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

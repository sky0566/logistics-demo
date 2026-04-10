'use client';

import { useState } from 'react';

interface ContactFormProps {
  services?: { slug: string; name: string }[];
  defaultService?: string;
}

export default function ContactForm({ services, defaultService }: ContactFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: defaultService || '',
    message: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      if (honeypot) { setStatus('success'); return; }
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website: honeypot }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', company: '', service: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot field - hidden from real users */}
      <div className="absolute opacity-0 -z-10" aria-hidden="true" tabIndex={-1}>
        <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2 tracking-wide">Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all text-sm"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2 tracking-wide">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all text-sm"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2 tracking-wide">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all text-sm"
            placeholder="+86 xxx xxxx xxxx"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2 tracking-wide">Company</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all text-sm"
            placeholder="Company Name"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 tracking-wide">Service Interested In</label>
        <select
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all text-sm text-gray-600"
        >
          <option value="">Select a service</option>
          {services && services.length > 0 ? (
            services.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)
          ) : (
            <>
              <option value="ocean-freight">Ocean Freight</option>
              <option value="air-freight">Air Freight</option>
              <option value="rail-freight">Rail Freight</option>
              <option value="customs-brokerage">Customs Brokerage</option>
              <option value="warehousing">Warehousing</option>
              <option value="door-to-door">Door to Door</option>
            </>
          )}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 tracking-wide">Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all resize-none text-sm"
          placeholder="Tell us about your logistics needs..."
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-full text-sm font-medium transition-all disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
      {status === 'success' && (
        <p className="text-green-600 text-center text-sm">Message sent successfully! We&apos;ll get back to you soon.</p>
      )}
      {status === 'error' && (
        <p className="text-red-600 text-center text-sm">Failed to send message. Please try again.</p>
      )}
    </form>
  );
}

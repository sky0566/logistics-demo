import Link from 'next/link';
import { getDb } from '@/lib/db';

interface LinkItem {
  label: string;
  href: string;
}

const DEFAULTS: Record<string, string> = {
  company_name: 'Global',
  company_name_highlight: 'Logistics',
  company_description: 'We specialize in international trade logistics business, providing sea transportation, air transportation, rail freight, customs brokerage and multi-modal transport services worldwide.',
  contact_address: 'Room 1701-4, Building 1, Shenyue International Building, Shaoxing, Zhejiang, China',
  contact_phone: '+86 575 8529 8303',
  contact_email: 'info@globallogistics.com',
  footer_services: JSON.stringify([
    { label: 'Ocean Freight', href: '/services#ocean-freight' },
    { label: 'Air Freight', href: '/services#air-freight' },
    { label: 'Rail Freight', href: '/services#rail-freight' },
    { label: 'Customs Brokerage', href: '/services#customs-brokerage' },
    { label: 'Warehousing', href: '/services#warehousing' },
    { label: 'Door to Door', href: '/services#door-to-door' },
  ]),
  footer_quick_links: JSON.stringify([
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'News Center', href: '/news' },
    { label: 'Contact Us', href: '/contact' },
  ]),
  footer_copyright: '© {year} Global Logistics. All Rights Reserved.',
  footer_bottom_links: JSON.stringify([
    { label: 'Privacy Policy', href: '/about' },
    { label: 'Terms of Service', href: '/about' },
  ]),
};

function safeParseLinks(json: string): LinkItem[] {
  try { return JSON.parse(json); } catch { return []; }
}

function getSettings(): Record<string, string> {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
    const settings: Record<string, string> = { ...DEFAULTS };
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return settings;
  } catch {
    return DEFAULTS;
  }
}

export default function Footer() {
  const s = getSettings();
  const serviceLinks = safeParseLinks(s.footer_services);
  const quickLinks = safeParseLinks(s.footer_quick_links);
  const bottomLinks = safeParseLinks(s.footer_bottom_links);
  const copyrightText = s.footer_copyright.replace('{year}', new Date().getFullYear().toString());

  return (
    <footer className="bg-dark text-white/60">
      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Company info */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-base font-medium text-white tracking-tight">
                {s.company_name}<span className="text-primary">{s.company_name_highlight}</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">{s.company_description}</p>
          </div>

          {/* Services */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-xs tracking-[0.15em] uppercase text-white font-medium mb-5">Services</h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs tracking-[0.15em] uppercase text-white font-medium mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-xs tracking-[0.15em] uppercase text-white font-medium mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <svg className="w-4 h-4 text-white/40 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {s.contact_address}
              </li>
              <li className="flex items-center gap-3 text-sm">
                <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {s.contact_phone}
              </li>
              <li className="flex items-center gap-3 text-sm">
                <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {s.contact_email}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-white/30">
          <p>{copyrightText}</p>
          <div className="flex items-center gap-6 mt-3 sm:mt-0">
            {bottomLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-white/60 transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

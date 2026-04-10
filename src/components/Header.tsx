'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
];

interface SiteSettings {
  company_name: string;
  company_name_highlight: string;
  contact_phone: string;
  contact_email: string;
  working_hours: string;
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    company_name: 'Global',
    company_name_highlight: 'Logistics',
    contact_phone: '+86 575 8529 8303',
    contact_email: 'info@globallogistics.com',
    working_hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((data) => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300 ${scrolled ? 'bg-primary' : 'bg-white/20 backdrop-blur-sm'}`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className={`text-lg font-semibold tracking-tight transition-colors duration-300 ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              {settings.company_name}<span className="text-primary">{settings.company_name_highlight}</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 rounded-full ${scrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`ml-4 px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${scrolled ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-white text-gray-900 hover:bg-white/90'}`}
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className={`w-6 h-6 transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl mt-2 p-4 space-y-1 animate-scale-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block py-3 px-4 bg-primary text-white rounded-xl text-sm font-medium text-center mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Get Quote
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

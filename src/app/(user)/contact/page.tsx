import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { getDb } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our logistics team for a free quote or any inquiries.',
};

function getSettings(): Record<string, string> {
  const DEFAULTS: Record<string, string> = {
    contact_address: 'Room 1701-4, Building 1, Shenyue International Building, Shaoxing, Zhejiang, China',
    contact_phone: '+86 575 8529 8303',
    contact_email: 'info@globallogistics.com',
    working_hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
  };
  try {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
    const s: Record<string, string> = { ...DEFAULTS };
    for (const r of rows) s[r.key] = r.value;
    return s;
  } catch { return DEFAULTS; }
}

function getServices(): { slug: string; name: string }[] {
  try {
    const db = getDb();
    return db.prepare('SELECT slug, name FROM services WHERE is_active = 1 ORDER BY sort_order ASC').all() as { slug: string; name: string }[];
  } catch { return []; }
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const s = getSettings();
  const services = getServices();
  const { service: defaultService } = await searchParams;

  return (
    <>
      {/* Banner */}
      <section className="relative h-[60vh] min-h-[400px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=1920&h=800&fit=crop)' }}>
        <div className="absolute inset-0 bg-dark/60" />
        <div className="relative z-10 h-full flex items-end pb-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
            <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight">Contact Us</h1>
            <p className="text-white/50 mt-4 text-lg font-light">We&apos;d Love to Hear From You</p>
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-5 gap-16 lg:gap-24">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-medium mb-4">Get In Touch</p>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">Let&apos;s Connect</h2>
              <div className="mt-12 space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Address</h4>
                    <p className="text-gray-400 text-sm mt-1">{s.contact_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-400 text-sm mt-1">{s.contact_phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email</h4>
                    <p className="text-gray-400 text-sm mt-1">{s.contact_email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Working Hours</h4>
                    <p className="text-gray-400 text-sm mt-1">{s.working_hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
                <h2 className="text-xl font-light text-gray-900 tracking-tight">Send Us a Message</h2>
                <p className="text-gray-400 text-sm mt-2 mb-8">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
                <ContactForm services={services} defaultService={defaultService} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

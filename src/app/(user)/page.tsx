import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import ContactForm from '@/components/ContactForm';
import { getDb } from '@/lib/db';

const DEFAULTS: Record<string, string> = {
  contact_address: 'Room 1701-4, Building 1, Shenyue International Building, Shaoxing, Zhejiang, China',
  contact_phone: '+86 575 8529 8303',
  contact_email: 'info@globallogistics.com',
  home_stats: JSON.stringify([
    { number: '50+', label: 'Countries Served' },
    { number: '1000+', label: 'Shipments Monthly' },
    { number: '200+', label: 'Global Partners' },
    { number: '99%', label: 'Customer Satisfaction' },
  ]),
  home_partners: JSON.stringify(['MSK', 'EMC', 'HMM', 'COSCO', 'OOCL', 'MSC', 'CNC', 'YML', 'SITC', 'HPL', 'PIL', 'ZIM']),
  home_about_title: 'Your Trusted International Logistics Partner',
  home_about_text: 'We specialize in international trade logistics business, providing sea transportation, air transportation, haulage, warehousing, custom declaration, marketing, export & import, inland truck transportation and other multi-modal transport services to domestic as well as overseas customers.',
  home_about_text2: 'Staffed by a highly educated and experienced team with many years of experience in forwarding, we ensure cargo will be professionally handled under our specific skills.',
  home_about_highlights: JSON.stringify([
    { number: '01', label: 'Professional Service' },
    { number: '02', label: 'Expert Handling' },
    { number: '03', label: 'Cost Efficient' },
  ]),
  home_about_years: '3+',
  home_about_image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop',
  home_cta_title: "To Define, Don't Be Defined",
  home_cta_text: 'We can provide a unique logistics solution tailored for your business needs.',
};

function safeJson<T>(json: string, fallback: T): T {
  try { return JSON.parse(json); } catch { return fallback; }
}

function getSettings(): Record<string, string> {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
    const s: Record<string, string> = { ...DEFAULTS };
    for (const r of rows) s[r.key] = r.value;
    return s;
  } catch { return DEFAULTS; }
}

interface DbService { id: number; name: string; slug: string; description: string; icon: string; }

function getTopServices(): DbService[] {
  try {
    const db = getDb();
    return db.prepare('SELECT id, name, slug, description, icon FROM services WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 4').all() as DbService[];
  } catch { return []; }
}

export default function HomePage() {
  const s = getSettings();
  const dbServices = getTopServices();
  const stats = safeJson<{ number: string; label: string }[]>(s.home_stats, []);
  const partners = safeJson<string[]>(s.home_partners, []);
  const highlights = safeJson<{ number: string; label: string }[]>(s.home_about_highlights, []);

  return (
    <>
      {/* Hero */}
      <HeroSlider />

      {/* Stats */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-extralight text-gray-900 tracking-tight">{stat.number}</div>
                <div className="text-sm text-gray-400 mt-3 tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-28 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-medium mb-4">About Us</p>
              <h2 className="text-3xl md:text-5xl font-light text-gray-900 leading-tight tracking-tight">
                {s.home_about_title}
              </h2>
              <p className="text-gray-500 leading-relaxed mt-8 text-[15px]">{s.home_about_text}</p>
              <p className="text-gray-500 leading-relaxed mt-4 text-[15px]">{s.home_about_text2}</p>
              <div className="flex gap-6 mt-10">
                {highlights.map((h) => (
                  <div key={h.number} className="flex-1">
                    <div className="text-2xl font-light text-primary">{h.number}</div>
                    <div className="text-xs text-gray-400 mt-1 tracking-wide">{h.label}</div>
                  </div>
                ))}
              </div>
              <Link href="/about" className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 mt-10 group hover:text-primary transition-colors">
                Learn More
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden">
                <img
                  src={s.home_about_image}
                  alt="Logistics operations"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-primary text-white px-8 py-6 rounded-2xl shadow-2xl">
                <div className="text-4xl font-light">{s.home_about_years}</div>
                <div className="text-sm text-white/70 mt-1">Years of Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-primary font-medium mb-4">What We Offer</p>
            <h2 className="text-3xl md:text-5xl font-light text-gray-900 tracking-tight">Our Services</h2>
            <p className="text-gray-500 mt-6 text-[15px] leading-relaxed">
              Our well-trained staff strive to provide the upmost level of service to local importers and exporters with efficient and cost-saving alternatives.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden">
            {dbServices.map((service) => (
              <Link
                key={service.id}
                href={`/services#${service.slug}`}
                className="bg-white p-8 hover:bg-gray-50 transition-all duration-300 group"
              >
                <div className="text-3xl mb-6">{service.icon || '📦'}</div>
                <h3 className="text-base font-medium text-gray-900 group-hover:text-primary transition-colors">{service.name}</h3>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed line-clamp-3">{service.description}</p>
                <span className="inline-flex items-center gap-1.5 text-primary text-sm mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                  Explore
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=600&fit=crop)' }} />
        <div className="absolute inset-0 bg-dark/80" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white tracking-tight">{s.home_cta_title}</h2>
          <p className="text-white/50 text-lg mt-6 max-w-xl mx-auto font-light">{s.home_cta_text}</p>
          <Link href="/contact" className="inline-block mt-10 px-10 py-3.5 bg-white text-gray-900 text-sm font-medium rounded-full hover:bg-white/90 transition-all">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-primary font-medium mb-4">Our Partners</p>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">Trusted by World-Class Shipping Lines</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {partners.map((p) => (
              <div
                key={p}
                className="px-6 py-3 bg-gray-50 rounded-full text-gray-500 text-sm font-medium hover:bg-primary hover:text-white transition-all duration-300 cursor-default"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="py-28 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-medium mb-4">Get In Touch</p>
              <h2 className="text-3xl md:text-5xl font-light text-gray-900 tracking-tight">Request A Free Quote</h2>
              <p className="text-gray-500 mt-6 text-[15px] leading-relaxed">
                Contact us today and receive a competitive quotation for your logistics needs. Our team is ready to assist you.
              </p>
              <div className="mt-12 space-y-6">
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Office</h4>
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
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10 border border-gray-100">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

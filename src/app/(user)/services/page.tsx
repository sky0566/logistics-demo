import type { Metadata } from 'next';
import Link from 'next/link';
import { getDb } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Professional international logistics services including ocean freight, air freight, rail freight, and customs brokerage.',
};

interface DbService {
  id: number;
  name: string;
  slug: string;
  description: string;
  content: string;
  features: string | null;
  icon: string;
  image: string;
  sort_order: number;
}

function getServices(): DbService[] {
  const db = getDb();
  return db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC').all() as DbService[];
}

function parseFeatures(features: string | null): string[] {
  if (!features) return [];
  try { return JSON.parse(features); } catch { return []; }
}

export default function ServicesPage() {
  const services = getServices();

  return (
    <>
      {/* Banner */}
      <section className="relative h-[60vh] min-h-[400px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&h=800&fit=crop)' }}>
        <div className="absolute inset-0 bg-dark/60" />
        <div className="relative z-10 h-full flex items-end pb-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
            <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight">Our Services</h1>
            <p className="text-white/50 mt-4 text-lg font-light">Professional International Logistics Solutions</p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-20">
            <p className="text-xs tracking-[0.2em] uppercase text-primary font-medium mb-4">What We Offer</p>
            <h2 className="text-3xl md:text-5xl font-light text-gray-900 tracking-tight">Comprehensive Logistics Services</h2>
            <p className="text-gray-500 mt-6 text-[15px] leading-relaxed">
              Our well-trained staff strive to provide the upmost level of service to local importers and exporters, building long-term relationships on the basis of honesty, competitiveness and trust.
            </p>
          </div>

          <div className="space-y-24">
            {services.map((service, idx) => {
              const features = parseFeatures(service.features);
              return (
                <div
                  key={service.slug}
                  id={service.slug}
                  className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center`}
                >
                  <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="rounded-3xl overflow-hidden">
                      <img src={service.image} alt={service.name} className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  </div>
                  <div className={idx % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="text-3xl mb-4">{service.icon}</div>
                    <h3 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight">{service.name}</h3>
                    <p className="text-gray-500 text-[15px] leading-relaxed mt-5">{service.description}</p>
                    {features.length > 0 && (
                      <ul className="mt-6 space-y-2.5">
                        {features.map((f) => (
                          <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-1 h-1 bg-primary rounded-full shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link href={`/contact?service=${service.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 mt-8 group hover:text-primary transition-colors">
                      Get a Quote
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-dark" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white tracking-tight">Need a Custom Solution?</h2>
          <p className="text-white/40 mt-6 text-lg font-light max-w-xl mx-auto">Contact us today and we&apos;ll design the perfect solution for your business.</p>
          <Link href="/contact" className="inline-block mt-10 px-10 py-3.5 bg-white text-gray-900 text-sm font-medium rounded-full hover:bg-white/90 transition-all">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}

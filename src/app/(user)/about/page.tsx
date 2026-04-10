import type { Metadata } from 'next';
import { getDb } from '@/lib/db';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about our international logistics company and our experienced team.',
};

const DEFAULTS: Record<string, string> = {
  about_company_title: 'Global Logistics International',
  about_company_text: 'Established in 2022 and registered the NVOCC qualification at the same time. We specialize in international trade logistics business, providing sea transportation, air transportation, haulage, warehousing, custom declaration, marketing, export & import, inland truck transportation and other multi-modal transport services to domestic as well as overseas customers.\n\nWith office located in Shenyue International Building, Qixian Street, Keqiao District, Shaoxing City, Zhejiang Province, China, we are staffed by a highly educated and experienced team with many years of experiences in forwarding.\n\nSince its foundation, the company successfully enjoys good reputation among clients with the advantages of efficient service, professional management, comprehensive route resources, reasonable and normative freight rates system.',
  about_mission: 'Under the fast-increased demand for logistics, it puts even a higher request for forwarders to be more professional and competent. We stick to providing competitive price, timely transportation, individualized value-added logistics services and integrated global automation. We keep expanding our business to more areas, endeavoring to gain a top place in this field.',
  about_advantages: JSON.stringify([
    { icon: '🏆', title: 'Professional Team', desc: 'Highly educated and experienced team with many years of experience in forwarding.' },
    { icon: '🌍', title: 'Global Network', desc: 'Partners in Ningbo, Shanghai, Tianjin and all major ports. International network throughout the world.' },
    { icon: '💰', title: 'Competitive Pricing', desc: 'Efficient and cost-saving alternatives with reasonable and normative freight rates system.' },
    { icon: '🤝', title: 'Strong Partnerships', desc: 'Cooperative partners like MSK, EMC, HMM, COSCO, OOCL, MSC and many more world-class shipping lines.' },
    { icon: '📦', title: 'Multi-modal Transport', desc: 'Sea, air, rail, haulage, warehousing, customs - comprehensive logistics solutions.' },
    { icon: '⚡', title: 'Efficient Service', desc: 'Good reputation among clients with efficient service and professional management.' },
  ]),
  about_partners_text: 'We take time to build good relationships with world-class airlines and shipping lines. We have competitive cooperative partners like MSK, EMC, HMM, MCC, COSCO, OOCL, YML, CNC, MSC, SITC, CUL, HPL, PIL, ZIM, etc. We can offer direct and transshipment services from all major loading ports of China with efficient and cost-saving alternatives available to customers.',
  about_partners_text2: 'We also have good partners in Ningbo, Shanghai, Tianjin and other major ports in China. Meanwhile, we have built a large international partners network throughout the world.',
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

export default function AboutPage() {
  const s = getSettings();
  const advantages = safeJson<{ icon: string; title: string; desc: string }[]>(s.about_advantages, []);
  const companyParagraphs = s.about_company_text.split('\n\n').filter(Boolean);

  return (
    <>
      {/* Banner */}
      <section className="relative h-[60vh] min-h-[400px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=1920&h=800&fit=crop)' }}>
        <div className="absolute inset-0 bg-dark/60" />
        <div className="relative z-10 h-full flex items-end pb-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
            <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight">About Us</h1>
            <p className="text-white/50 mt-4 text-lg font-light">Your Trusted International Logistics Partner</p>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-medium mb-4">Who We Are</p>
              <h2 className="text-3xl md:text-5xl font-light text-gray-900 tracking-tight">{s.about_company_title}</h2>
              <div className="mt-8 space-y-4">
                {companyParagraphs.map((p, i) => (
                  <p key={i} className="text-gray-500 text-[15px] leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&h=300&fit=crop" alt="Shipping" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="rounded-2xl overflow-hidden mt-10">
                <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop" alt="Container" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=400&h=300&fit=crop" alt="Port" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="rounded-2xl overflow-hidden mt-10">
                <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=300&fit=crop" alt="Warehouse" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-dark" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-white/40 font-medium mb-4">Our Mission</p>
          <p className="text-white/80 text-xl md:text-2xl leading-relaxed font-light">{s.about_mission}</p>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-28 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-primary font-medium mb-4">Why Choose Us</p>
            <h2 className="text-3xl md:text-5xl font-light text-gray-900 tracking-tight">Our Advantages</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 rounded-2xl overflow-hidden">
            {advantages.map((a) => (
              <div key={a.title} className="bg-white p-8 hover:bg-gray-50 transition-colors duration-300">
                <div className="text-3xl mb-5">{a.icon}</div>
                <h3 className="text-base font-medium text-gray-900 mb-2">{a.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-primary font-medium mb-4">Our Partners</p>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">Global Shipping Network</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-gray-500 text-center text-[15px] leading-relaxed">{s.about_partners_text}</p>
            <p className="text-gray-500 text-center text-[15px] leading-relaxed">{s.about_partners_text2}</p>
          </div>
        </div>
      </section>
    </>
  );
}

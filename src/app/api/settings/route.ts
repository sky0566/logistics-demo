import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export interface SiteSettings {
  // Company
  company_name: string;
  company_name_highlight: string;
  company_description: string;
  // Contact
  contact_address: string;
  contact_phone: string;
  contact_email: string;
  contact_whatsapp: string;
  contact_wechat: string;
  working_hours: string;
  // Homepage
  home_stats: string; // JSON [{number, label}]
  home_partners: string; // JSON string[]
  home_about_title: string;
  home_about_text: string;
  home_about_text2: string;
  home_about_highlights: string; // JSON [{number, label}]
  home_about_years: string;
  home_about_image: string;
  home_cta_title: string;
  home_cta_text: string;
  // About page
  about_company_title: string;
  about_company_text: string;
  about_mission: string;
  about_advantages: string; // JSON [{icon, title, desc}]
  about_partners_text: string;
  about_partners_text2: string;
  // Footer
  footer_services: string;
  footer_quick_links: string;
  footer_copyright: string;
  footer_bottom_links: string;
}

const DEFAULTS: Record<string, string> = {
  company_name: 'Global',
  company_name_highlight: 'Logistics',
  company_description: 'We specialize in international trade logistics business, providing sea transportation, air transportation, rail freight, customs brokerage and multi-modal transport services worldwide.',
  contact_address: 'Room 1701-4, Building 1, Shenyue International Building, Shaoxing, Zhejiang, China',
  contact_phone: '+86 575 8529 8303',
  contact_email: 'info@globallogistics.com',
  contact_whatsapp: '',
  contact_wechat: '',
  working_hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
  // Homepage
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
  // About page
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
  // Footer
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

// Public: anyone can read settings
export async function GET() {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
  const settings: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return NextResponse.json(settings);
}

// Admin only: update settings
export async function PUT(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json() as Record<string, string>;
  const db = getDb();

  const upsert = db.prepare(
    `INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`
  );

  const validKeys = Object.keys(DEFAULTS);
  const tx = db.transaction(() => {
    for (const [key, value] of Object.entries(body)) {
      if (validKeys.includes(key) && typeof value === 'string') {
        upsert.run(key, value);
      }
    }
  });
  tx();

  return NextResponse.json({ success: true });
}

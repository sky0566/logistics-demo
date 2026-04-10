import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'logistics.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    must_change_password INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content TEXT,
    features TEXT,
    icon TEXT,
    image TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    image TEXT,
    category TEXT DEFAULT 'company',
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    service TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    logo TEXT,
    website TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subtitle TEXT,
    image TEXT NOT NULL,
    link TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS company_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    ip_hash TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Seed admin user
const existingAdmin = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
if (!existingAdmin) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash);
  console.log('✅ Admin user created: admin / admin123');
}

// Seed services
const existingServices = db.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number };
if (existingServices.count === 0) {
  const services = [
    {
      name: 'Ocean Freight',
      slug: 'ocean-freight',
      description: 'Ocean freight is the most common way of delivering goods. Cheaper than air freight and faster than rail freight. The best choice for customers to send goods all over the world.',
      content: '<h2>Professional Ocean Freight Services</h2><p>We provide comprehensive ocean freight services including FCL (Full Container Load) and LCL (Less Container Load) options. Our extensive network covers all major ports worldwide.</p><h3>Our Ocean Freight Features</h3><ul><li>FCL & LCL services available</li><li>Direct and transshipment routes</li><li>Coverage of all major ports</li><li>Competitive freight rates</li><li>Real-time cargo tracking</li><li>Professional documentation support</li></ul><p>With partnerships with major shipping lines like MSK, EMC, COSCO, OOCL, MSC, and more, we ensure reliable and efficient ocean transportation for your cargo.</p>',
      features: JSON.stringify(['FCL & LCL services', 'Direct & transshipment routes', 'All major ports coverage', 'Competitive rates', 'Real-time tracking']),
      icon: '🚢',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=500&fit=crop',
      sort_order: 1,
    },
    {
      name: 'Air Freight',
      slug: 'air-freight',
      description: 'Air freight is fast, efficient, and the mode of choice for those who need to deliver cargo rapidly and reliably. It suits small quantity goods which need fast delivery.',
      content: '<h2>Express Air Freight Solutions</h2><p>When speed matters most, our air freight services deliver. We work with major airlines worldwide to provide fast, reliable air cargo transportation.</p><h3>Air Freight Advantages</h3><ul><li>Fastest mode of transportation</li><li>Ideal for time-sensitive shipments</li><li>Door-to-airport and airport-to-airport options</li><li>Dangerous goods handling capability</li><li>Temperature-controlled options</li><li>Global coverage through airline partnerships</li></ul>',
      features: JSON.stringify(['Express delivery', 'Door-to-airport service', 'Dangerous goods handling', 'Temperature controlled', 'Worldwide coverage']),
      icon: '✈️',
      image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=500&fit=crop',
      sort_order: 2,
    },
    {
      name: 'Rail Freight',
      slug: 'rail-freight',
      description: 'Rail freight is developing fast under Chinese government support. It can reach inland areas that other transportation modes cannot, especially China-Europe routes.',
      content: '<h2>China-Europe Rail Freight</h2><p>Under the Belt and Road Initiative, rail freight has become an increasingly important logistics channel connecting China with Europe and Central Asia.</p><h3>Rail Freight Benefits</h3><ul><li>China-Europe direct routes</li><li>Reaches inland destinations</li><li>Cost-effective alternative to air freight</li><li>Faster than ocean freight</li><li>Government-supported infrastructure</li><li>Growing network coverage</li></ul>',
      features: JSON.stringify(['China-Europe routes', 'Belt & Road coverage', 'Container transport', 'Inland destinations', 'Cost effective']),
      icon: '🚂',
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=500&fit=crop',
      sort_order: 3,
    },
    {
      name: 'Customs Brokerage',
      slug: 'customs-brokerage',
      description: 'Professional customs clearance services for both import and export. We specialize in FCL/LCL textile door-to-door customs clearance.',
      content: '<h2>Expert Customs Brokerage</h2><p>Our dedicated customs brokerage team handles all aspects of import and export customs clearance, ensuring smooth and compliant passage of your goods.</p><h3>Customs Services Include</h3><ul><li>Import & export customs clearance</li><li>Complete documentation preparation</li><li>Textile trade specialization</li><li>Compliance consulting</li><li>Duty optimization</li><li>Door-to-door service integration</li></ul>',
      features: JSON.stringify(['Import & export clearance', 'Documentation support', 'Textile specialization', 'Compliance assistance', 'Door-to-door service']),
      icon: '📋',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop',
      sort_order: 4,
    },
    {
      name: 'Warehousing',
      slug: 'warehousing',
      description: 'Modern warehousing solutions with efficient inventory management, consolidation services and distribution support for your supply chain needs.',
      content: '<h2>Warehousing & Distribution</h2><p>Our modern warehouse facilities provide comprehensive storage and distribution solutions to optimize your supply chain.</p><h3>Warehouse Features</h3><ul><li>Inventory management systems</li><li>Cargo consolidation services</li><li>Pick and pack operations</li><li>Cross-docking capabilities</li><li>Climate-controlled storage</li><li>24/7 security monitoring</li></ul>',
      features: JSON.stringify(['Inventory management', 'Cargo consolidation', 'Distribution center', 'Pick and pack', 'Climate controlled']),
      icon: '🏭',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=500&fit=crop',
      sort_order: 5,
    },
    {
      name: 'Door to Door',
      slug: 'door-to-door',
      description: 'Complete door-to-door logistics solutions handling everything from pickup at origin to final delivery at the destination.',
      content: '<h2>Complete Door-to-Door Service</h2><p>Let us handle your entire logistics chain. From pickup at your factory to delivery at the final destination, we manage every step.</p><h3>Door-to-Door Includes</h3><ul><li>Factory/warehouse pickup</li><li>Multi-modal transportation</li><li>Customs clearance at both ends</li><li>Last-mile delivery</li><li>Single point of contact</li><li>Full tracking visibility</li></ul>',
      features: JSON.stringify(['Pickup service', 'Multi-modal transport', 'Last mile delivery', 'Single point of contact', 'Full tracking']),
      icon: '🚛',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=500&fit=crop',
      sort_order: 6,
    },
  ];

  const insertService = db.prepare(
    'INSERT INTO services (name, slug, description, content, features, icon, image, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  for (const s of services) {
    insertService.run(s.name, s.slug, s.description, s.content, s.features, s.icon, s.image, s.sort_order);
  }
  console.log(`✅ ${services.length} services created`);
}

// Seed news
const existingNews = db.prepare('SELECT COUNT(*) as count FROM news').get() as { count: number };
if (existingNews.count === 0) {
  const newsArticles = [
    {
      title: 'We Specialize in International Trade Logistics Business',
      slug: 'specialize-international-trade-logistics',
      content: '<p>We specialize in international trade logistics business, providing sea transportation, air transportation, haulage, warehousing, custom declaration, marketing, export & import, inland truck transportation and other multi-modal transport services to domestic as well as overseas customers.</p><p>Our team is staffed by highly educated and experienced professionals with many years of experience in forwarding. We ensure the cargo will be professionally handled under our specific skills.</p><p>Our well-trained staff strive to provide upmost level of service to local importers and exports and stand on establishing long-term relationships with our clients on basis of honest, competitiveness and trust.</p>',
      excerpt: 'We specialize in international trade logistics business, providing comprehensive multi-modal transport services worldwide.',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=400&fit=crop',
      category: 'company',
    },
    {
      title: 'Our Partnership Network Continues to Expand',
      slug: 'partnership-network-expanding',
      content: '<p>We take time to build good relationships with world-class airlines and shipping lines. Our competitive cooperative partners include MSK, EMC, HMM, MCC, COSCO, OOCL, YML, CNC, MSC, SITC, CUL, HPL, PIL, ZIM, and many more.</p><p>We can offer direct and transshipment services from all major ports loading of China with efficient and cost-saving alternatives available to customers.</p><p>We also have strong partners in Ningbo, Shanghai, Tianjin and other major ports in China. Our international partners network spans throughout the world, enabling door-to-door service to every corner of the globe.</p>',
      excerpt: 'Building strong relationships with world-class airlines and shipping lines for better service.',
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=400&fit=crop',
      category: 'company',
    },
    {
      title: 'China-Europe Rail Services Growing Rapidly',
      slug: 'china-europe-rail-services-growing',
      content: '<p>Rail freight services between China and Europe continue to see unprecedented growth, driven by the Belt and Road Initiative and increasing demand for reliable land-based transportation alternatives.</p><p>The China-Europe railway express service has become an important logistics channel, offering transit times of approximately 15-18 days, significantly faster than ocean freight while remaining more cost-effective than air freight.</p><p>Our company has expanded its rail freight capabilities to serve customers along these growing corridors, providing seamless connectivity to inland European and Central Asian destinations.</p>',
      excerpt: 'Rail freight between China and Europe continues to grow, offering faster and more reliable service.',
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=400&fit=crop',
      category: 'industry',
    },
  ];

  const insertNews = db.prepare(
    'INSERT INTO news (title, slug, content, excerpt, image, category) VALUES (?, ?, ?, ?, ?, ?)'
  );

  for (const n of newsArticles) {
    insertNews.run(n.title, n.slug, n.content, n.excerpt, n.image, n.category);
  }
  console.log(`✅ ${newsArticles.length} news articles created`);
}

// Seed partners
const existingPartners = db.prepare('SELECT COUNT(*) as count FROM partners').get() as { count: number };
if (existingPartners.count === 0) {
  const partners = ['MSK', 'EMC', 'HMM', 'COSCO', 'OOCL', 'MSC', 'YML', 'CNC', 'SITC', 'HPL', 'PIL', 'ZIM'];
  const insertPartner = db.prepare('INSERT INTO partners (name, sort_order) VALUES (?, ?)');
  partners.forEach((p, i) => insertPartner.run(p, i));
  console.log(`✅ ${partners.length} partners created`);
}

console.log('\n🚀 Database seeded successfully!');
console.log('📝 Admin login: admin / admin123');
console.log('🌐 Run "npm run dev" to start the development server');

db.close();

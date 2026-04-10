import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

const isVercel = !!process.env.VERCEL;

export function getDb(): Database.Database {
  if (db) return db;

  let dbPath: string;

  if (isVercel) {
    // Vercel serverless: use /tmp/ (ephemeral, re-created per cold start)
    dbPath = '/tmp/logistics.db';
  } else {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    dbPath = path.join(dataDir, 'logistics.db');
  }

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  initializeDb(db);

  // On Vercel, seed demo data if the DB is empty (cold start)
  if (isVercel) {
    const count = (db.prepare('SELECT COUNT(*) as c FROM services').get() as { c: number }).c;
    if (count === 0) {
      seedDemoData(db);
    }
  }

  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

function initializeDb(db: Database.Database) {
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
      page_title TEXT,
      referrer TEXT,
      user_agent TEXT,
      ip_hash TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // service_items table for sub-services
  db.exec(`
    CREATE TABLE IF NOT EXISTS service_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );
  `);

  // Migrations for existing databases
  const cols = db.prepare("PRAGMA table_info(services)").all() as { name: string }[];
  if (!cols.find(c => c.name === 'features')) {
    db.exec("ALTER TABLE services ADD COLUMN features TEXT");
  }

  const pvCols = db.prepare("PRAGMA table_info(page_views)").all() as { name: string }[];
  if (!pvCols.find(c => c.name === 'page_title')) {
    db.exec("ALTER TABLE page_views ADD COLUMN page_title TEXT");
  }

  const inqCols = db.prepare("PRAGMA table_info(inquiries)").all() as { name: string }[];
  if (!inqCols.find(c => c.name === 'admin_notes')) {
    db.exec("ALTER TABLE inquiries ADD COLUMN admin_notes TEXT DEFAULT ''");
  }
}

function seedDemoData(db: Database.Database) {
  // Admin user (bcryptjs hash of 'admin123')
  db.prepare('INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)').run(
    'admin', '$2b$10$DETzJFkZipUgdiY/2X4NX.EpS5Q6I1Xrid3VDtXmbkRZ5qRe1f0gO'
  );

  // Services
  const services = [
    { name: 'Ocean Freight', slug: 'ocean-freight', desc: 'Ocean freight is the most common way of delivering goods. Cheaper than air freight and faster than rail freight.', features: '["FCL & LCL services","Direct & transshipment routes","All major ports coverage","Competitive rates","Real-time tracking"]', icon: '🚢', image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=500&fit=crop', sort: 1 },
    { name: 'Air Freight', slug: 'air-freight', desc: 'Air freight is fast, efficient, and the mode of choice for those who need to deliver cargo rapidly and reliably.', features: '["Express delivery","Door-to-airport service","Dangerous goods handling","Temperature controlled","Worldwide coverage"]', icon: '✈️', image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800&h=500&fit=crop', sort: 2 },
    { name: 'Rail Freight', slug: 'rail-freight', desc: 'Rail freight is developing fast under Chinese government support. It can reach inland areas that other modes cannot.', features: '["China-Europe routes","Belt & Road coverage","Container transport","Inland destinations","Cost effective"]', icon: '🚂', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=500&fit=crop', sort: 3 },
    { name: 'Customs Brokerage', slug: 'customs-brokerage', desc: 'Professional customs clearance services for both import and export. We specialize in textile door-to-door clearance.', features: '["Import & export clearance","Documentation support","Textile specialization","Compliance assistance","Door-to-door service"]', icon: '📋', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop', sort: 4 },
    { name: 'Warehousing', slug: 'warehousing', desc: 'Modern warehousing solutions with efficient inventory management, consolidation services and distribution support.', features: '["Inventory management","Cargo consolidation","Distribution center","Pick and pack","Climate controlled"]', icon: '🏭', image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=500&fit=crop', sort: 5 },
    { name: 'Door to Door', slug: 'door-to-door', desc: 'Complete door-to-door logistics solutions handling everything from pickup at origin to final delivery.', features: '["Pickup service","Multi-modal transport","Last mile delivery","Single point of contact","Full tracking"]', icon: '🚛', image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=500&fit=crop', sort: 6 },
  ];
  const ins = db.prepare('INSERT INTO services (name, slug, description, features, icon, image, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const s of services) ins.run(s.name, s.slug, s.desc, s.features, s.icon, s.image, s.sort);

  // News
  const news = [
    { title: 'We Specialize in International Trade Logistics Business', slug: 'specialize-international-trade-logistics', excerpt: 'We specialize in international trade logistics business, providing comprehensive multi-modal transport services worldwide.', image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=400&fit=crop', category: 'company' },
    { title: 'Our Partnership Network Continues to Expand', slug: 'partnership-network-expanding', excerpt: 'Building strong relationships with world-class airlines and shipping lines for better service.', image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=400&fit=crop', category: 'company' },
    { title: 'China-Europe Rail Services Growing Rapidly', slug: 'china-europe-rail-services-growing', excerpt: 'Rail freight between China and Europe continues to grow, offering faster and more reliable service.', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=400&fit=crop', category: 'industry' },
  ];
  const insN = db.prepare('INSERT INTO news (title, slug, excerpt, image, category) VALUES (?, ?, ?, ?, ?)');
  for (const n of news) insN.run(n.title, n.slug, n.excerpt, n.image, n.category);

  // Partners
  const partners = ['MSK', 'EMC', 'HMM', 'COSCO', 'OOCL', 'MSC', 'YML', 'CNC', 'SITC', 'HPL', 'PIL', 'ZIM'];
  const insP = db.prepare('INSERT INTO partners (name, sort_order) VALUES (?, ?)');
  partners.forEach((p, i) => insP.run(p, i));

  // Banners
  const banners = [
    { title: 'Professional International Logistics', subtitle: 'Sea, Air, Rail & Multi-modal Transport Solutions', image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1920&h=800&fit=crop' },
    { title: 'Global Shipping Network', subtitle: 'Connecting Your Business to the World', image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&h=800&fit=crop' },
    { title: 'Reliable Customs Brokerage', subtitle: 'Professional Import & Export Services', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=800&fit=crop' },
  ];
  const insB = db.prepare('INSERT INTO banners (title, subtitle, image, sort_order) VALUES (?, ?, ?, ?)');
  banners.forEach((b, i) => insB.run(b.title, b.subtitle, b.image, i));
}

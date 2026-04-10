import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const range = request.nextUrl.searchParams.get('range') || '30';
  const days = parseInt(range) || 30;

  const totalInquiries = (db.prepare('SELECT COUNT(*) as count FROM inquiries').get() as { count: number }).count;
  const newInquiries = (db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'").get() as { count: number }).count;
  const totalNews = (db.prepare('SELECT COUNT(*) as count FROM news WHERE is_active = 1').get() as { count: number }).count;
  const totalServices = (db.prepare('SELECT COUNT(*) as count FROM services WHERE is_active = 1').get() as { count: number }).count;

  const recentInquiries = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5').all();

  // Traffic summary periods (like gallop)
  const trafficQuery = (start: string, end?: string) => {
    const where = end
      ? `WHERE date(created_at) >= date('now', ?) AND date(created_at) <= date('now', ?)`
      : `WHERE date(created_at) >= date('now', ?)`;
    const params = end ? [start, end] : [start];
    return db.prepare(`SELECT COUNT(*) as views, COUNT(DISTINCT ip_hash) as visitors FROM page_views ${where}`).get(...params) as { views: number; visitors: number };
  };
  const today = trafficQuery('start of day');
  const yesterday = trafficQuery('-1 day', '-1 day');
  const thisWeek = trafficQuery('-7 days');
  const thisMonth = trafficQuery('-30 days');
  const allTime = db.prepare('SELECT COUNT(*) as views, COUNT(DISTINCT ip_hash) as visitors FROM page_views').get() as { views: number; visitors: number };

  const trafficSummary = [
    { label: 'Today', views: today.views, visitors: today.visitors },
    { label: 'Yesterday', views: yesterday.views, visitors: yesterday.visitors },
    { label: 'This Week', views: thisWeek.views, visitors: thisWeek.visitors },
    { label: 'This Month', views: thisMonth.views, visitors: thisMonth.visitors },
    { label: 'All Time', views: allTime.views, visitors: allTime.visitors },
  ];

  // Daily traffic for charts
  const dailyTraffic = db.prepare(`
    SELECT date(created_at) as date, COUNT(*) as views, COUNT(DISTINCT ip_hash) as visitors
    FROM page_views
    WHERE created_at >= datetime('now', ?)
    GROUP BY date(created_at)
    ORDER BY date ASC
  `).all(`-${days} days`) as { date: string; views: number; visitors: number }[];

  // Top pages
  const topPages = db.prepare(`
    SELECT page_path, page_title, COUNT(*) as views, COUNT(DISTINCT ip_hash) as visitors
    FROM page_views
    WHERE created_at >= datetime('now', ?)
    GROUP BY page_path
    ORDER BY views DESC
    LIMIT 10
  `).all(`-${days} days`) as { page_path: string; page_title: string; views: number; visitors: number }[];

  // Online visitors (heartbeat within 2 minutes)
  const onlineVisitors = (db.prepare(`
    SELECT COUNT(DISTINCT ip_hash) as count
    FROM page_views
    WHERE created_at >= datetime('now', '-2 minutes')
  `).get() as { count: number }).count;

  // Referrer stats
  const referrers = db.prepare(`
    SELECT referrer as name, COUNT(*) as views
    FROM page_views
    WHERE referrer != '' AND referrer IS NOT NULL AND created_at >= datetime('now', ?)
    GROUP BY referrer
    ORDER BY views DESC
    LIMIT 10
  `).all(`-${days} days`) as { name: string; views: number }[];

  return NextResponse.json({
    totalInquiries,
    newInquiries,
    totalNews,
    totalServices,
    trafficSummary,
    onlineVisitors,
    recentInquiries,
    dailyTraffic,
    topPages,
    referrers,
  });
}

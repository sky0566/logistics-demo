import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page_path, page_title, referrer, heartbeat } = body;

    if (!page_path) {
      return NextResponse.json({ error: 'Missing page_path' }, { status: 400 });
    }

    const db = getDb();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '0.0.0.0';
    const ipHash = crypto.createHash('sha256').update(ip + 'logistics-salt').digest('hex').slice(0, 16);
    const ua = req.headers.get('user-agent') || '';

    if (heartbeat) {
      // Update last_visit for online tracking
      db.prepare(`
        UPDATE page_views SET created_at = datetime('now')
        WHERE id = (SELECT id FROM page_views WHERE ip_hash = ? ORDER BY created_at DESC LIMIT 1)
      `).run(ipHash);
    } else {
      db.prepare(`
        INSERT INTO page_views (page_path, page_title, referrer, user_agent, ip_hash, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `).run(page_path, page_title || '', referrer || '', ua, ipHash);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Track failed' }, { status: 500 });
  }
}

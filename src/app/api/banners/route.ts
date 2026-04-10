import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const db = getDb();
  const token = request.cookies.get('admin_token')?.value;
  // Admin gets all banners, public only active
  const sql = token
    ? 'SELECT * FROM banners ORDER BY sort_order ASC'
    : 'SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC';
  const banners = db.prepare(sql).all();
  return NextResponse.json(banners);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { title, subtitle, image, link, sort_order } = body;

  if (!image) {
    return NextResponse.json({ error: 'Image is required' }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO banners (title, subtitle, image, link, sort_order) VALUES (?, ?, ?, ?, ?)'
  ).run(title || '', subtitle || '', image, link || '', sort_order || 0);

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

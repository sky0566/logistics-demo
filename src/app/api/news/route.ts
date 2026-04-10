import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const news = db.prepare('SELECT * FROM news ORDER BY created_at DESC').all();
  return NextResponse.json(news);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { title, slug, content, excerpt, image, category } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO news (title, slug, content, excerpt, image, category) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(title, slug, content || '', excerpt || '', image || '', category || 'company');

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

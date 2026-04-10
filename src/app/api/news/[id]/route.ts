import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const news = db.prepare('SELECT * FROM news WHERE id = ?').get(id);
  if (!news) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(news);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, slug, content, excerpt, image, category, is_active } = body;

  const db = getDb();
  db.prepare(
    `UPDATE news SET title=?, slug=?, content=?, excerpt=?, image=?, category=?, is_active=?, updated_at=datetime('now') WHERE id=?`
  ).run(title, slug, content, excerpt, image, category, is_active, id);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  db.prepare('DELETE FROM news WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}

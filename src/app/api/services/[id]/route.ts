import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const service = db.prepare('SELECT * FROM services WHERE id = ?').get(id);
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(service);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { name, slug, description, content, features, icon, image, sort_order, is_active } = body;

  const db = getDb();
  db.prepare(
    `UPDATE services SET name=?, slug=?, description=?, content=?, features=?, icon=?, image=?, sort_order=?, is_active=?, updated_at=datetime('now') WHERE id=?`
  ).run(name, slug, description, content, features || '[]', icon, image, sort_order, is_active, id);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  db.prepare('DELETE FROM services WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}

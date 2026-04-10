import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, subtitle, image, link, sort_order, is_active } = body;

  if (!image) {
    return NextResponse.json({ error: 'Image is required' }, { status: 400 });
  }

  const db = getDb();
  db.prepare(
    `UPDATE banners SET title=?, subtitle=?, image=?, link=?, sort_order=?, is_active=? WHERE id=?`
  ).run(title || '', subtitle || '', image, link || '', sort_order ?? 0, is_active ?? 1, id);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  db.prepare('DELETE FROM banners WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}

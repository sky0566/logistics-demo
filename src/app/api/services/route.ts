import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const services = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC').all();
  return NextResponse.json(services);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, slug, description, content, features, icon, image, sort_order } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO services (name, slug, description, content, features, icon, image, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(name, slug, description || '', content || '', features || '[]', icon || '', image || '', sort_order || 0);

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

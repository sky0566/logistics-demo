import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/service-items?service_id=X
export async function GET(request: NextRequest) {
  const serviceId = request.nextUrl.searchParams.get('service_id');
  const db = getDb();

  if (serviceId) {
    const items = db.prepare('SELECT * FROM service_items WHERE service_id = ? ORDER BY sort_order ASC').all(serviceId);
    return NextResponse.json(items);
  }

  const items = db.prepare('SELECT * FROM service_items ORDER BY service_id, sort_order ASC').all();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { service_id, name, description, image, sort_order } = body;

  if (!service_id || !name) {
    return NextResponse.json({ error: 'service_id and name are required' }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO service_items (service_id, name, description, image, sort_order) VALUES (?, ?, ?, ?, ?)'
  ).run(service_id, name, description || '', image || '', sort_order || 0);

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

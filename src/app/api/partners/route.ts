import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const db = getDb();
  const token = request.cookies.get('admin_token')?.value;
  const sql = token
    ? 'SELECT * FROM partners ORDER BY sort_order ASC'
    : 'SELECT * FROM partners WHERE is_active = 1 ORDER BY sort_order ASC';
  const partners = db.prepare(sql).all();
  return NextResponse.json(partners);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, logo, website, sort_order } = body;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO partners (name, logo, website, sort_order) VALUES (?, ?, ?, ?)'
  ).run(name, logo || '', website || '', sort_order || 0);

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

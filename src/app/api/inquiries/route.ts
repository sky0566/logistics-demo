import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
  return NextResponse.json(inquiries);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, company, service, message, website } = body;

  // Honeypot check
  if (website) {
    return NextResponse.json({ id: 0 }, { status: 201 });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO inquiries (name, email, phone, company, service, message) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, email, phone || '', company || '', service || '', message);

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

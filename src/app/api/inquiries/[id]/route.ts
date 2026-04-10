import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { status, admin_notes } = body;

  const db = getDb();
  const sets: string[] = ["updated_at = datetime('now')"];
  const vals: (string | number)[] = [];

  if (status !== undefined) {
    sets.push('status = ?');
    vals.push(status);
  }
  if (admin_notes !== undefined) {
    sets.push('admin_notes = ?');
    vals.push(admin_notes);
  }

  vals.push(id);
  db.prepare(`UPDATE inquiries SET ${sets.join(', ')} WHERE id = ?`).run(...vals);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  db.prepare('DELETE FROM inquiries WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}

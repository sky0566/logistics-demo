import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, comparePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Both passwords are required' }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM admin_users LIMIT 1').get() as { id: number; password_hash: string } | undefined;

  if (!user || !comparePassword(currentPassword, user.password_hash)) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
  }

  const newHash = hashPassword(newPassword);
  db.prepare(`UPDATE admin_users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?`).run(newHash, user.id);

  return NextResponse.json({ success: true });
}

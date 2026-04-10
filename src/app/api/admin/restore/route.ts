import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || req.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    if (!file.name.endsWith('.db')) {
      return NextResponse.json({ error: 'Invalid file format. Must be a .db file.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Verify it's a valid SQLite database
    const header = buffer.toString('utf8', 0, 16);
    if (!header.startsWith('SQLite format 3')) {
      return NextResponse.json({ error: 'Not a valid SQLite database' }, { status: 400 });
    }

    const dbPath = path.join(process.cwd(), 'data', 'logistics.db');

    // Create backup of current DB before restoring
    const backupDir = path.join(process.cwd(), 'data', 'backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, path.join(backupDir, `pre-restore-${timestamp}.db`));
    }

    // Remove WAL/SHM files
    try { fs.unlinkSync(dbPath + '-wal'); } catch { /* ignore */ }
    try { fs.unlinkSync(dbPath + '-shm'); } catch { /* ignore */ }

    // Write new DB
    fs.writeFileSync(dbPath, buffer);

    return NextResponse.json({ ok: true, message: 'Database restored successfully. Please restart the server.' });
  } catch {
    return NextResponse.json({ error: 'Restore failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || req.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbPath = path.join(process.cwd(), 'data', 'logistics.db');
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: 'Database not found' }, { status: 404 });
    }

    // Create a temp backup copy
    const backupDir = path.join(process.cwd(), 'data', 'backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupFile = path.join(backupDir, `logistics-backup-${timestamp}.db`);

    // Use sqlite3 backup via file copy (WAL checkpoint first)
    try {
      const Database = (await import('better-sqlite3')).default;
      const db = new Database(dbPath, { readonly: true });
      db.pragma('wal_checkpoint(TRUNCATE)');
      db.close();
    } catch { /* ignore checkpoint errors */ }

    fs.copyFileSync(dbPath, backupFile);

    const fileBuffer = fs.readFileSync(backupFile);

    // Clean up temp file
    try { fs.unlinkSync(backupFile); } catch { /* ignore */ }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="logistics-backup-${timestamp}.db"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Backup failed' }, { status: 500 });
  }
}

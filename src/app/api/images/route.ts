import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET /api/images — list all images in public/images folder tree
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || req.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const search = req.nextUrl.searchParams.get('search') || '';
    const imagesDir = path.join(process.cwd(), 'public', 'images');

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      fs.mkdirSync(path.join(imagesDir, 'uploads'), { recursive: true });
    }

    const folders: { folder: string; files: string[] }[] = [];

    function scanDir(dir: string, folderName: string) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      const files: string[] = [];

      for (const entry of entries) {
        if (entry.isDirectory()) {
          scanDir(path.join(dir, entry.name), `${folderName}/${entry.name}`);
        } else if (/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(entry.name)) {
          const filePath = `/images${folderName}/${entry.name}`;
          if (!search || filePath.toLowerCase().includes(search.toLowerCase())) {
            files.push(filePath);
          }
        }
      }

      if (files.length > 0) {
        folders.push({ folder: folderName || 'root', files });
      }
    }

    scanDir(imagesDir, '');

    // Ensure uploads folder is always present
    if (!folders.find(f => f.folder === '/uploads')) {
      folders.unshift({ folder: '/uploads', files: [] });
    }

    return NextResponse.json({ folders });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
  }
}

// DELETE /api/images — delete uploaded images
export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || req.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { files } = await req.json();
    if (!Array.isArray(files)) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    const errors: string[] = [];
    for (const file of files) {
      // Only allow deleting from uploads folder
      if (!file.startsWith('/images/uploads/')) {
        errors.push(`Cannot delete ${file}: only uploads can be deleted`);
        continue;
      }
      const filePath = path.join(process.cwd(), 'public', file);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch {
        errors.push(`Failed to delete ${file}`);
      }
    }

    return NextResponse.json({ ok: true, errors });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

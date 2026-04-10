import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || req.cookies.get('admin_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploaded: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        // Validate file type
        if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)) {
          errors.push(`${file.name}: unsupported format`);
          continue;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name}: exceeds 10MB limit`);
          continue;
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const hash = crypto.createHash('md5').update(buffer).digest('hex').slice(0, 8);
        const ext = path.extname(file.name);
        const safeName = file.name.replace(ext, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
        const fileName = `${safeName}_${hash}${ext}`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, buffer);
        uploaded.push(`/images/uploads/${fileName}`);
      } catch {
        errors.push(`${file.name}: upload failed`);
      }
    }

    return NextResponse.json({ uploaded, errors });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

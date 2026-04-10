import { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  const db = getDb();

  const services = db.prepare('SELECT slug, updated_at FROM services WHERE is_active = 1').all() as { slug: string; updated_at: string }[];
  const news = db.prepare('SELECT slug, updated_at FROM news WHERE is_active = 1').all() as { slug: string; updated_at: string }[];

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  const newsPages: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${baseUrl}/news/${n.slug}`,
    lastModified: new Date(n.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...newsPages];
}

import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import MarkdownContent from '@/components/MarkdownContent';
import type { Metadata } from 'next';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  created_at: string;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const news = db.prepare('SELECT * FROM news WHERE slug = ? AND is_active = 1').get(slug) as NewsItem | undefined;
  if (!news) return { title: 'Not Found' };
  return { title: news.title, description: news.excerpt };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb();
  const news = db.prepare('SELECT * FROM news WHERE slug = ? AND is_active = 1').get(slug) as NewsItem | undefined;

  if (!news) notFound();

  return (
    <>
      {/* Banner */}
      <section className="relative h-[50vh] min-h-[350px] bg-cover bg-center" style={{ backgroundImage: `url(${news.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=800&fit=crop'})` }}>
        <div className="absolute inset-0 bg-dark/60" />
        <div className="relative z-10 h-full flex items-end pb-16">
          <div className="max-w-[900px] mx-auto px-6 lg:px-10 w-full">
            <div className="flex items-center gap-3 mb-4 text-white/50 text-sm">
              <span>{news.category}</span>
              <span>·</span>
              <span>{formatDate(news.created_at)}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight leading-tight">{news.title}</h1>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[700px] mx-auto px-6 lg:px-10">
          <MarkdownContent content={news.content || ''} className="prose-headings:font-light prose-headings:tracking-tight prose-p:text-gray-500 prose-p:text-[15px] prose-p:leading-relaxed" />
          <div className="mt-16 pt-8 border-t border-gray-100">
            <Link href="/news" className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 group hover:text-primary transition-colors">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
              Back to News
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'News Center',
  description: 'Latest news and updates from our international logistics company.',
};

export const dynamic = 'force-dynamic';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  created_at: string;
}

export default function NewsPage() {
  const db = getDb();
  const news = db.prepare('SELECT * FROM news WHERE is_active = 1 ORDER BY created_at DESC').all() as NewsItem[];

  return (
    <>
      {/* Banner */}
      <section className="relative h-[60vh] min-h-[400px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=800&fit=crop)' }}>
        <div className="absolute inset-0 bg-dark/60" />
        <div className="relative z-10 h-full flex items-end pb-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
            <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight">News Center</h1>
            <p className="text-white/50 mt-4 text-lg font-light">Stay Updated with Our Latest News</p>
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {news.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📰</div>
              <h3 className="text-xl font-light text-gray-700 mb-2">No News Yet</h3>
              <p className="text-gray-400 text-sm">Check back soon for updates.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  {item.image && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-medium text-primary">{item.category}</span>
                      <span className="text-xs text-gray-300">{formatDate(item.created_at)}</span>
                    </div>
                    <h3 className="text-base font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                    {item.excerpt && (
                      <p className="text-gray-400 text-sm mt-2 line-clamp-3">{item.excerpt}</p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                      Read More
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PageTracker } from '@/components/PageTracker';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageTracker />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

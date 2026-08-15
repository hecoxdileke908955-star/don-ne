import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePageClient } from '@/components/HomePageClient';
import { getPublishedHomePage } from '@/lib/page-data';
import { getPublicFaqs } from '@/lib/faq-data';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedHomePage();
  if (!page?.seoTitle && !page?.seoDescription) return {};

  return {
    title: page.seoTitle ?? undefined,
    description: page.seoDescription ?? undefined,
    openGraph: {
      title: page.seoTitle ?? undefined,
      description: page.seoDescription ?? undefined,
    },
  };
}

export default async function HomePage() {
  const page = await getPublishedHomePage();

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <p className="text-center text-sm text-text-muted">Nội dung trang chủ tạm thời chưa khả dụng.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const faqs = await getPublicFaqs();

  return <HomePageClient sections={page.sections} faqs={faqs} />;
}

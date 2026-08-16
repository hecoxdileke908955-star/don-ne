import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import { SiteConfigProvider } from '@/components/SiteConfigProvider';
import { getPublicSiteConfig } from '@/lib/site-config-data';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPublicSiteConfig();
  const brandName = config?.brandName ?? 'Thông tin thương hiệu';
  const description = config?.slogan ?? 'Thông tin website tạm thời chưa khả dụng.';

  return {
    title: `${brandName} — Dịch Vụ Vệ Sinh Chuyên Nghiệp Văn Giang, Hưng Yên`,
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    icons: { icon: '/favicon.png', apple: '/favicon.png' },
    openGraph: { title: brandName, description, images: ['/logo-web.png'] },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getPublicSiteConfig();

  return (
    <html lang="vi">
      <body className={`${beVietnamPro.className} bg-surface font-sans text-text-main antialiased selection:bg-primary-soft selection:text-primary`}>
        <SiteConfigProvider config={config}>{children}</SiteConfigProvider>
      </body>
    </html>
  );
}

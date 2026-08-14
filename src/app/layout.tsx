import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Dọn Nè — Dịch Vụ Vệ Sinh Công Nghiệp & Nhà Cửa Chuyên Nghiệp Hà Nội',
  description: 'Dịch vụ tổng vệ sinh nhà cửa, căn hộ chung cư, văn phòng, sau xây dựng và giặt đệm sofa tại Hà Nội. Giá minh bạch, nghiệm thu hài lòng mới thanh toán.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Dọn Nè — Vệ Sinh Nhà Cửa & Công Nghiệp Hà Nội',
    description: 'Chuyên nghiệp, minh bạch, nghiệm thu 100% hài lòng mới nhận thanh toán. Hotline 0964.182.330.',
    images: ['/logo-web.png'],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.className} bg-surface font-sans text-text-main antialiased selection:bg-primary-soft selection:text-primary`}>
        {children}
      </body>
    </html>
  );
}

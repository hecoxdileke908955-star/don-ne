import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FALLBACK_SITE_CONFIG } from '@/lib/global-settings';

export default function ThankYouPage() {
  const config = FALLBACK_SITE_CONFIG;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 bg-surface-secondary px-4">
        <div className="max-w-md w-full rounded-card bg-white p-8 border border-gray-200 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-3xl text-primary mb-4">
            ✓
          </div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Tiếp Nhận Thành Công</span>
          <h1 className="text-2xl font-bold text-text-main mt-1">Cảm Ơn Quý Khách!</h1>
          <p className="text-xs text-text-muted mt-3 leading-relaxed">
            Hệ thống Dọn Nè đã ghi nhận yêu cầu báo giá. Chuyên viên kỹ thuật khu vực của chúng tôi sẽ gọi điện lại qua số điện thoại của quý khách trong vòng <strong>5 phút</strong>.
          </p>

          <div className="mt-6 flex flex-col gap-2">
            <a
              href={`https://zalo.me/${config.zaloNumbers[0]}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-ctrl bg-[#0068FF] py-3 text-xs font-bold text-white shadow hover:bg-blue-700 transition"
            >
              💬 Nhắn Zalo Gửi Thêm Ảnh Hiện Trạng
            </a>
            <Link
              href="/"
              className="rounded-ctrl border border-gray-300 py-2.5 text-xs font-semibold text-text-main hover:bg-surface-secondary transition"
            >
              Về Trang Chủ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

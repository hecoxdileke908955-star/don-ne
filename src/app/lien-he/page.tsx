'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { QuoteFormModal } from '@/components/QuoteFormModal';
import { PageBanner } from '@/components/PageBanner';
import { useSiteConfig } from '@/components/SiteConfigProvider';

export default function ContactPage() {
  const config = useSiteConfig();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const mapHref = config?.mainAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.mainAddress)}` : undefined;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-12 bg-surface-secondary">
        {/* Round 4.2: reference /lien-he/ page-shell order confirmed by
            opening the real page — eyebrow+H1 → banner photo → intro prose
            → contact content, single content column (max-w-[860px]). */}
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Kết Nối Với {config?.brandName ?? 'Chúng Tôi'}</p>
          <h1 className="text-3xl font-extrabold text-text-main sm:text-4xl">Liên Hệ</h1>

          <PageBanner
            caption={`${config?.brandName ?? 'Dọn Nè'} — sẵn sàng hỗ trợ`}
            image="/images/home/dn-service-04.jpeg"
            imageAlt="Nhân viên Dọn Nè tiếp nhận yêu cầu dịch vụ"
          />

          <p className="mb-8 text-sm leading-relaxed text-text-muted">
            {config?.brandName ?? 'Dọn Nè'} tiếp nhận yêu cầu dịch vụ vệ sinh tại Hà Nội qua hotline, Zalo hoặc biểu
            mẫu bên dưới. Để được báo giá nhanh và chính xác, quý khách có thể gửi kèm mô tả hiện trạng hoặc diện
            tích cần vệ sinh.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="space-y-4 rounded-[22px] border border-gray-200 bg-white p-7 shadow-sm">
              <h2 className="text-lg font-bold text-text-main">Thông Tin Liên Hệ</h2>

              {config ? (
                <div className="space-y-3 text-sm text-text-muted">
                  <p><strong className="text-text-main">Hotline/Zalo:</strong> {config.hotlines.join(' – ')}</p>
                  <p><strong className="text-text-main">Email:</strong> {config.emails[0]}</p>
                  <p><strong className="text-text-main">Địa chỉ:</strong> {config.mainAddress}</p>
                  <p><strong className="text-text-main">Giờ làm việc:</strong> {config.workingHours}</p>
                  {mapHref && (
                    <a href={mapHref} target="_blank" rel="noreferrer noopener" className="inline-block text-sm font-bold text-primary hover:underline">
                      Xem trên Google Maps →
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm text-text-muted">Thông tin liên hệ tạm thời chưa khả dụng.</p>
              )}

              <div className="flex flex-col gap-2 pt-2">
                {config?.hotlines[0] && (
                  <a href={`tel:${config.hotlines[0].replace(/\./g, '')}`} className="rounded-ctrl bg-primary py-3 text-center text-sm font-bold text-white hover:bg-primary-hover">
                    📞 Gọi {config.hotlines[0]}
                  </a>
                )}
                {config?.zaloNumbers[0] && (
                  <a href={`https://zalo.me/${config.zaloNumbers[0]}`} target="_blank" rel="noreferrer noopener" className="rounded-ctrl bg-[#0068FF] py-3 text-center text-sm font-bold text-white hover:bg-blue-700">
                    💬 Nhắn Zalo
                  </a>
                )}
              </div>
            </section>

            <section className="flex flex-col justify-center rounded-[22px] border border-primary/20 bg-primary-soft p-7 text-center">
              <h2 className="text-lg font-bold text-text-main">Gửi Yêu Cầu Tư Vấn</h2>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">
                Điền thông tin, {config?.brandName ?? 'Dọn Nè'} liên hệ tư vấn và báo giá miễn phí trong 5 phút.
              </p>
              <button onClick={() => setIsQuoteOpen(true)} className="mt-5 rounded-ctrl bg-primary px-6 py-3 text-sm font-bold text-white shadow hover:bg-primary-hover">
                Điền Thông Tin Nhận Báo Giá
              </button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <QuoteFormModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}

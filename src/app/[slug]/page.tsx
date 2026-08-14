'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { QuoteFormModal } from '@/components/QuoteFormModal';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { FAQSection } from '@/components/sections/FAQSection';

interface ServiceDetailProps {
  params: { slug: string };
}

interface ServiceProcessStep {
  step: string;
  name: string;
  desc: string;
}

interface ServiceDetailData {
  title: string;
  badge: string;
  desc: string;
  whenNeeded: string[];
  includedItems: string[];
  excludedItems: string[];
  priceText: string;
  process: ServiceProcessStep[];
}

const SERVICE_DATA: Record<string, ServiceDetailData> = {
  've-sinh-nha-cua': {
    title: 'Dịch Vụ Tổng Vệ Sinh Nhà Cửa Trọn Gói Hà Nội',
    badge: 'Phổ biến nhất cho gia đình',
    desc: 'Làm sạch toàn diện từng ngóc ngách ngôi nhà từ trần, tường, sàn đến kính, toilet và khu vực bếp. Nghiệm thu hài lòng 100% mới thanh toán.',
    whenNeeded: [
      'Nhà ở định kỳ 3–6 tháng cần tổng dọn dẹp sạch sâu.',
      'Gia đình vừa chuyển đến nhà mới hoặc trả nhà thuê.',
      'Chuẩn bị đón Tết Nguyên Đán, tân gia, đám cưới hoặc sự kiện lớn.',
      'Nhà lâu ngày không ở bị bám bụi và ẩm mốc.'
    ],
    includedItems: [
      'Hút bụi trần thạch cao, quét mạng nhện, lau bóng đèn và quạt trần.',
      'Lau kính cửa sổ, cửa kính ban công 2 mặt trong nhà.',
      'Cọ rửa toilet, tẩy cặn canxi vách tắm kính và bồn cầu bằng hóa chất sinh học.',
      'Tẩy sạch dầu mỡ két dính tại khu vực bếp, mặt bếp từ, máy hút mùi.',
      'Chà sàn bằng máy công nghiệp và hút sạch khô ráo toàn bộ mặt sàn.'
    ],
    excludedItems: [
      'Giặt ghế sofa, giặt đệm cao su (ưu đãi giảm 20% khi đặt kèm gói).',
      'Lau kính ngoài trời tòa nhà cao tầng cần đu dây thừng.'
    ],
    priceText: '12.000 – 18.000đ / m² hoặc 800.000 – 1.900.000đ / Căn hộ trọn gói',
    process: [
      { step: '1', name: 'Khảo sát & Báo giá', desc: 'Đo đạc diện tích thực tế và chốt chi phí minh bạch không phát sinh.' },
      { step: '2', name: 'Dọn thô & Hút bụi', desc: 'Thu gom rác thô và dùng máy hút bụi công nghiệp 3 mô-tơ xử lý bụi mịn.' },
      { step: '3', name: 'Tẩy ố & Làm sạch chi tiết', desc: 'Xử lý từng phòng ngủ, phòng khách, khu bếp và nhà vệ sinh.' },
      { step: '4', name: 'Nghiệm thu & Bàn giao', desc: 'Khách hàng kiểm tra từng phòng đạt yêu cầu mới ký thanh toán.' }
    ]
  },
  've-sinh-sau-xay-dung': {
    title: 'Dịch Vụ Vệ Sinh Công Trình Sau Xây Dựng Tại Hà Nội',
    badge: 'Thiết bị công nghiệp 3 mô-tơ',
    desc: 'Xử lý triệt để bụi xi măng, sơn bám sàn gạch, keo dán thảm trên toàn bộ công trình nhà ở, biệt thự, showroom sau khi hoàn thiện nội thất.',
    whenNeeded: [
      'Công trình vừa hoàn thiện thợ xây, thợ sơn và lắp đặt đồ gỗ nội thất.',
      'Căn hộ chung cư nhận bàn giao thô từ chủ đầu tư.',
      'Showroom, nhà hàng vừa thi công cải tạo lại mặt bằng.'
    ],
    includedItems: [
      'Thu gom toàn bộ phế thải xây dựng thô còn sót lại.',
      'Sủi sạch sơn nước, sơn dầu và xi măng bám trên bề mặt sàn và chân tường.',
      'Hút bụi mịn công nghiệp trong toàn bộ ngăn kéo tủ và khe cửa sổ.',
      'Bóc tem mác bảo vệ trên thiết bị vệ sinh, kính và đồ gỗ nội thất.',
      'Chà rửa đánh bóng sàn gạch và hút nước khô ráo.'
    ],
    excludedItems: [
      'Vận chuyển xà bần khối lượng lớn (tính theo chuyến xe tải riêng).'
    ],
    priceText: '15.000 – 25.000đ / m² diện tích sàn',
    process: [
      { step: '1', name: 'Tiếp nhận công trình', desc: 'Đánh giá mức độ bẩn của sơn, keo và bụi xi măng.' },
      { step: '2', name: 'Vệ sinh thô từ trên xuống', desc: 'Hút bụi trần, khe hắt đèn và tường thạch cao.' },
      { step: '3', name: 'Sủi tẩy keo & Chà sàn', desc: 'Dùng hóa chất chuyên dụng đánh bật vết ố và xi măng.' },
      { step: '4', name: 'Nghiệm thu chuẩn mực', desc: 'Bàn giao mặt sàn sạch bóng không còn bụi mịn.' }
    ]
  }
};

export default function ServiceDetailPage({ params }: ServiceDetailProps) {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const slug = params.slug || 've-sinh-nha-cua';
  const data = SERVICE_DATA[slug] || SERVICE_DATA['ve-sinh-nha-cua'];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header onOpenQuote={() => setIsQuoteOpen(true)} />

      <main className="flex-1 py-10 bg-surface">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
            <Link href="/" className="hover:text-primary">Trang chủ</Link>
            <span>/</span>
            <Link href="/dich-vu" className="hover:text-primary">Dịch vụ</Link>
            <span>/</span>
            <span className="text-text-main font-bold">{data.title}</span>
          </nav>

          {/* Service Heading */}
          <div className="border-b border-gray-200 pb-8 mb-8">
            <span className="rounded bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
              {data.badge}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-text-main mt-3 leading-tight">
              {data.title}
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-text-muted max-w-3xl leading-relaxed">
              {data.desc}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsQuoteOpen(true)}
                className="rounded-ctrl bg-primary px-6 py-3 text-xs font-bold text-white shadow hover:bg-primary-hover transition"
              >
                📋 ĐẶT LỊCH KHẢO SÁT / BÁO GIÁ
              </button>
              <div className="text-xs text-text-muted">
                <strong>Đơn giá tham khảo:</strong> <span className="text-primary font-bold">{data.priceText}</span>
              </div>
            </div>
          </div>

          {/* When Needed */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text-main mb-4">Khi Nào Bạn Cần Dịch Vụ Này?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.whenNeeded.map((item: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-ctrl border border-gray-200 bg-surface-secondary p-3.5 text-xs text-text-main">
                  <span className="text-primary font-bold">✔</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Included vs Excluded */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text-main mb-4">Hạng Mục Bao Gồm & Tính Riêng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Included */}
              <div className="rounded-card border border-primary/30 bg-primary-soft/30 p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                  ✓ Hạng Mục Đã Bao Gồm Trong Gói
                </h3>
                <ul className="space-y-2 text-xs text-text-main">
                  {data.includedItems.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Excluded */}
              <div className="rounded-card border border-gray-200 bg-surface-secondary p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                  + Hạng Mục Tính Phí Riêng (Nếu Có Nhu Cầu)
                </h3>
                <ul className="space-y-2 text-xs text-text-muted">
                  {data.excludedItems.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Process Steps */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text-main mb-4">Quy Trình Thi Công 4 Bước</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.process.map((step, idx) => (
                <div key={idx} className="rounded-card border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-primary font-black text-lg mb-1">0{step.step}</div>
                  <h4 className="text-xs font-bold text-text-main mb-1">{step.name}</h4>
                  <p className="text-[11px] text-text-muted leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Before & After Real Evidence */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text-main mb-4">Hình Ảnh Nghiệm Thu Thực Tế</h2>
            <BeforeAfterSlider />
          </section>

          {/* FAQs */}
          <FAQSection props={{ heading: 'Câu Hỏi Về Dịch Vụ' }} />
        </div>
      </main>

      <Footer />
      <MobileStickyBar onOpenQuote={() => setIsQuoteOpen(true)} />
      <QuoteFormModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        defaultServiceSlug={slug}
      />
    </div>
  );
}

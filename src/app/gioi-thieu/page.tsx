'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { QuoteFormModal } from '@/components/QuoteFormModal';
import { PageBanner } from '@/components/PageBanner';
import { useSiteConfig } from '@/components/SiteConfigProvider';

const CUSTOMER_GROUPS = [
  { title: 'Hộ Gia Đình', desc: 'Nhà phố, căn hộ chung cư, biệt thự cần tổng vệ sinh định kỳ hoặc theo giờ.' },
  { title: 'Văn Phòng & Doanh Nghiệp', desc: 'Vệ sinh ngoài giờ hành chính, không ảnh hưởng hoạt động làm việc.' },
  { title: 'Công Trình Xây Dựng', desc: 'Vệ sinh sau xây dựng, bàn giao mặt bằng sạch trước khi đưa vào sử dụng.' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Tiếp Nhận & Khảo Sát', desc: 'Tư vấn qua điện thoại/Zalo hoặc khảo sát trực tiếp miễn phí.' },
  { num: '02', title: 'Báo Giá & Chốt Lịch', desc: 'Gửi phương án thi công chi tiết, chốt thời gian và nhân sự phù hợp.' },
  { num: '03', title: 'Thi Công Chuyên Nghiệp', desc: 'Đội ngũ mang đầy đủ thiết bị hiện đại, triển khai theo đúng quy trình.' },
  { num: '04', title: 'Nghiệm Thu & Bảo Hành', desc: 'Kiểm tra cùng khách hàng, ký nghiệm thu và hỗ trợ bảo hành sau khi hoàn thành.' },
];

export default function AboutPage() {
  const config = useSiteConfig();
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-12 bg-surface-secondary">
        {/* Round 4.2: reference /gioi-thieu/ page-shell order confirmed by
            opening the real page — eyebrow+H1 (plain, not on image) →
            banner photo → intro prose → page content, single content
            column (max-w-[860px]). Card sections below keep Dọn Nè's real
            structured content (customer groups/process/coverage) — no
            invented years/customers/awards/staff counts, per instruction. */}
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Về Chúng Tôi</p>
          <h1 className="text-3xl font-extrabold text-text-main sm:text-4xl">Giới Thiệu {config?.brandName ?? 'Dọn Nè'}</h1>

          <PageBanner
            caption={`${config?.brandName ?? 'Dọn Nè'} — dịch vụ vệ sinh chuyên nghiệp`}
            image="/images/home/dn-hero-01.jpeg"
            imageAlt="Nhân viên Dọn Nè thực hiện dịch vụ vệ sinh chuyên nghiệp"
          />

          <p className="text-sm leading-relaxed text-text-muted">
            {config?.brandName ?? 'Dọn Nè'} là đơn vị cung cấp dịch vụ vệ sinh nhà ở, văn phòng, công trình và nội thất tại
            Văn Giang, Hưng Yên và khu vực lân cận, với đội ngũ nhân sự có hồ sơ nhân thân rõ ràng và trang thiết bị
            chuyên dụng cho từng hạng mục công việc.
          </p>
          {config?.footerCommitment && (
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{config.footerCommitment}</p>
          )}

          <section className="mt-10">
            <h2 className="text-lg font-bold text-text-main">Khách Hàng Của {config?.brandName ?? 'Dọn Nè'}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {CUSTOMER_GROUPS.map((g) => (
                <div key={g.title} className="rounded-[20px] border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-text-main">{g.title}</h3>
                  <p className="mt-1.5 text-xs text-text-muted leading-relaxed">{g.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-bold text-text-main">Quy Trình Làm Việc</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PROCESS_STEPS.map((s) => (
                <div key={s.num} className="rounded-[20px] border border-gray-200 bg-white p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Bước {s.num}</span>
                  <h3 className="mt-1 text-sm font-bold text-text-main">{s.title}</h3>
                  <p className="mt-1.5 text-xs text-text-muted leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-[22px] border border-gray-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-bold text-text-main">Phạm Vi Phục Vụ</h2>
            <p className="mt-2 text-sm text-text-muted">Trụ sở chính: {config?.mainAddress ?? 'đang cập nhật'}.</p>
            <Link href="/khu-vuc-phuc-vu" className="mt-3 inline-block text-sm font-bold text-primary hover:underline">
              Xem toàn bộ khu vực phục vụ →
            </Link>
          </section>

          <section className="mt-10 rounded-2xl bg-primary p-7 text-center text-white">
            <h2 className="text-lg font-bold">Sẵn Sàng Trải Nghiệm Dịch Vụ?</h2>
            <p className="mt-1 text-xs text-primary-soft">Nhận khảo sát và báo giá miễn phí trong 5 phút.</p>
            <button onClick={() => setIsQuoteOpen(true)} className="mt-4 rounded-ctrl bg-white px-6 py-3 text-sm font-bold text-primary shadow hover:bg-gray-100">
              Nhận Báo Giá Ngay
            </button>
          </section>
        </div>
      </main>
      <Footer />
      <QuoteFormModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}

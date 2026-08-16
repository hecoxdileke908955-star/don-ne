'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSiteConfig } from '@/components/SiteConfigProvider';

export default function WarrantyPolicyPage() {
  const config = useSiteConfig();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-12 bg-surface-secondary">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold text-text-main sm:text-4xl">Chính Sách Bảo Hành</h1>

          <div className="mt-8 space-y-6 rounded-[22px] border border-gray-200 bg-white p-7 text-sm leading-relaxed text-text-muted shadow-sm">
            <section>
              <h2 className="mb-2 text-base font-bold text-text-main">1. Nghiệm Thu Trước Khi Thanh Toán</h2>
              <p>{config?.brandName ?? 'Dọn Nè'} cùng khách hàng kiểm tra từng hạng mục sau khi hoàn thành. Chỉ khi khách hàng hài lòng và ký nghiệm thu, {config?.brandName ?? 'Dọn Nè'} mới tiến hành thanh toán.</p>
            </section>
            <section>
              <h2 className="mb-2 text-base font-bold text-text-main">2. Bảo Hành Sau Thi Công</h2>
              <p>{config?.footerCommitment ?? 'Nếu phát hiện điểm chưa ưng ý trong phạm vi hợp đồng, đội thi công sẽ quay lại xử lý miễn phí trong 24 giờ kể từ thời điểm nghiệm thu.'}</p>
            </section>
            <section>
              <h2 className="mb-2 text-base font-bold text-text-main">3. Phạm Vi Áp Dụng</h2>
              <p>Chính sách bảo hành áp dụng cho các hạng mục đã được thống nhất trong báo giá và biên bản nghiệm thu. Các hạng mục phát sinh ngoài phạm vi ban đầu sẽ được tư vấn và báo giá riêng trước khi thực hiện.</p>
            </section>
            <section>
              <h2 className="mb-2 text-base font-bold text-text-main">4. Liên Hệ Bảo Hành</h2>
              <p>Quý khách vui lòng liên hệ hotline {config?.hotlines[0] ?? ''} hoặc Zalo để được hỗ trợ bảo hành nhanh nhất.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

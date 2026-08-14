import React from 'react';
import type { SectionContentProps } from '@/lib/section-schema';

const FAQS = [
  { q: 'Dọn Nè có mang đầy đủ hóa chất máy móc không?', a: 'Có. Đội thợ Dọn Nè trang bị đầy đủ máy hút bụi 3 mô-tơ, máy chà sàn, máy phun hút hơi nước nóng 140°C, thang nhôm và hóa chất chuyên dụng an toàn.' },
  { q: 'Khách hàng có cần chuẩn bị đồ đạc gì trước không?', a: 'Quý khách chỉ cần cất giữ tư trang cá nhân, tiền bạc quý giá. Toàn bộ khâu di dời đồ nhẹ và làm sạch do nhân viên Dọn Nè thực hiện.' },
  { q: 'Dọn Nè có xuất hóa đơn VAT và hợp đồng công ty không?', a: 'Có. Hỗ trợ đầy đủ hợp đồng kinh tế, biên bản nghiệm thu và hóa đơn điện tử VAT cho các cơ quan, văn phòng và doanh nghiệp.' },
];

export const FAQSection: React.FC<{ props: SectionContentProps }> = ({ props }) => {
  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-main text-center mb-8">
          {props.heading || 'Câu Hỏi Thường Gặp'}
        </h2>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="rounded-card border border-gray-200 bg-surface-secondary p-5">
              <h3 className="text-sm font-bold text-text-main mb-2">
                {idx + 1}. {faq.q}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

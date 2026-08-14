import React from 'react';
import type { SectionContentProps } from '@/lib/section-schema';

export const ProcessSection: React.FC<{ props: SectionContentProps }> = ({ props }) => {
  const steps = [
    { num: 'Bước 1', title: 'Tiếp nhận & Khảo sát', desc: 'Tư vấn nhanh qua điện thoại/Zalo hoặc kỹ thuật viên đến tận nơi khảo sát miễn phí.' },
    { num: 'Bước 2', title: 'Báo giá & Chốt lịch', desc: 'Gửi bảng phương án thi công chi tiết, chốt thời gian và số lượng nhân sự phù hợp.' },
    { num: 'Bước 3', title: 'Thi công chuyên nghiệp', desc: 'Đội ngũ Dọn Nè mang đầy đủ trang thiết bị hiện đại, triển khai dọn dẹp theo quy trình.' },
    { num: 'Bước 4', title: 'Nghiệm thu & Bảo hành', desc: 'Cùng khách hàng kiểm tra từng phòng, ký biên bản nghiệm thu và thanh toán.' },
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-main">
            {props.heading || 'Quy Trình Làm Việc 4 Bước Chuẩn Mực'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-text-muted">
            {props.subheading || 'Nhanh chóng, rõ ràng và đảm bảo quyền lợi tối đa của khách hàng'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((st, idx) => (
            <div key={idx} className="rounded-card border border-gray-200 bg-surface-secondary p-5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{st.num}</span>
              <h3 className="text-sm font-bold text-text-main mt-1 mb-2">{st.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

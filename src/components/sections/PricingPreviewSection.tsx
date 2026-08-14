import React from 'react';
import Link from 'next/link';
import { PricingCalculator } from '../PricingCalculator';
import type { SectionContentProps } from '@/lib/section-schema';

interface PricingPreviewProps {
  props: SectionContentProps;
  onOpenQuote?: () => void;
}

export const PricingPreviewSection: React.FC<PricingPreviewProps> = ({ props, onOpenQuote }) => {
  return (
    <section className="py-16 bg-surface-secondary border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-main">
            {props.heading || 'Bảng Giá Minh Bạch — Không Phát Sinh'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-text-muted">
            {props.subheading || 'Giá niêm yết rõ ràng theo diện tích thực tế và khối lượng công việc'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <PricingCalculator />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-card bg-white p-6 border border-gray-200 shadow-sm">
              <h4 className="text-sm font-bold text-text-main mb-3">Đặc Quyền Khách Hàng Dọn Nè</h4>
              <ul className="space-y-2.5 text-xs text-text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Khảo sát trực tiếp:</strong> Cán bộ kỹ thuật đo đạc báo giá chính xác, không ép giá.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Hóa chất chuẩn an toàn:</strong> 100% hóa chất chuyên dụng có nguồn gốc, an toàn cho trẻ nhỏ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Nghiệm thu mới trả tiền:</strong> Chỉ thanh toán khi đã kiểm tra từng hạng mục đạt yêu cầu.</span>
                </li>
              </ul>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={onOpenQuote}
                  className="flex-1 rounded-ctrl bg-primary py-2.5 text-center text-xs font-bold text-white hover:bg-primary-hover transition"
                >
                  Nhận Báo Giá Chi Tiết
                </button>
                <Link
                  href="/bang-gia"
                  className="rounded-ctrl border border-gray-300 px-4 py-2.5 text-center text-xs font-semibold text-text-main hover:bg-surface-secondary"
                >
                  Toàn Bộ Bảng Giá
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

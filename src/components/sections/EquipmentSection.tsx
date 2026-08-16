import React from 'react';
import Image from 'next/image';

/**
 * STATIC PUBLIC ADAPTER — Round 4, Phase 6.
 *
 * Split out of ProcessSection (Round 2/3 finding: Equipment was nested
 * inside the Process section instead of being its own homepage block like
 * the reference site). Reuses the same dn-equipment-01.jpeg asset — no new
 * image, no duplicate block left behind in ProcessSection.
 */
export const EquipmentSection: React.FC = () => {
  return (
    <section className="border-t border-gray-100 bg-surface-secondary py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-8 rounded-[22px] border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px]">
            <Image
              src="/images/home/dn-equipment-01.jpeg"
              alt="Máy chà sàn công nghiệp Dọn Nè sử dụng"
              fill
              quality={100}
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Trang Thiết Bị</p>
            <h2 className="text-lg font-bold text-text-main sm:text-xl">Thiết Bị Vệ Sinh Chuyên Dụng</h2>
            <p className="mt-3 text-xs leading-relaxed text-text-muted sm:text-sm">
              Đội ngũ Dọn Nè mang theo máy chà sàn công nghiệp, máy hút bụi công suất lớn cùng hóa chất chuyên dụng
              đạt chuẩn an toàn, đảm bảo năng lực thi công cho mọi mặt bằng từ nhà ở đến nhà xưởng quy mô lớn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

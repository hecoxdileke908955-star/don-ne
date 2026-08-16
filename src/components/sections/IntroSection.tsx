import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * STATIC PUBLIC ADAPTER — Round 4, Phase 4.
 *
 * The reference homepage has an "Intro" section right after the service
 * grid; Dọn Nè's SectionType CMS enum has no matching type (only 9 types
 * exist, adding one would require a schema migration + admin UI work that
 * is explicitly out of scope for this round). This component is a static,
 * public-only adapter rendered by DynamicSectionRenderer at the equivalent
 * position — no migration, no seed, no admin surface touched.
 *
 * Content is original Dọn Nè copy: no invented years-in-business, no
 * invented customer counts, no invented certifications.
 */
export const IntroSection: React.FC = () => {
  return (
    <section className="border-t border-gray-100 bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative order-2 aspect-[4/3] w-full overflow-hidden rounded-[28px] shadow-lg lg:order-1">
            <Image
              src="/images/home/dn-service-01.jpeg"
              alt="Đội ngũ Dọn Nè thực hiện dịch vụ vệ sinh"
              fill
              quality={100}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="order-1 text-center lg:order-2 lg:text-left">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Về Dọn Nè</p>
            <h2 className="text-2xl font-extrabold text-text-main sm:text-3xl">
              Đơn Vị Cung Cấp Dịch Vụ Vệ Sinh Toàn Diện Tại Hà Nội
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Dọn Nè cung cấp các dịch vụ vệ sinh nhà ở, căn hộ chung cư, văn phòng, sau xây dựng cùng dịch vụ giặt
              ghế sofa, giặt đệm, giặt thảm và lau kính. Đội thi công mang thiết bị chuyên dụng, làm việc theo quy
              trình rõ ràng và chỉ nhận thanh toán sau khi khách hàng nghiệm thu.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/dich-vu"
                className="rounded-ctrl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover"
              >
                Xem Tất Cả Dịch Vụ
              </Link>
              <Link
                href="/gioi-thieu"
                className="rounded-ctrl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-text-main transition hover:bg-surface-secondary"
              >
                Tìm Hiểu Thêm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

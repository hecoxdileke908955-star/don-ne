import React from 'react';
import type { SectionContentProps } from '@/lib/section-schema';

// Service area relocated: company address is 146 Vịnh Thiên Đường 7, Văn
// Giang, Hưng Yên — this fallback (used only when the CMS props above have
// no value) reflects the real ~10km radius, not Hanoi districts.
const AREAS = [
  'Vinhomes Ocean Park 2', 'Vinhomes Ocean Park 3', 'Nghĩa Trụ',
  'Như Quỳnh', 'Phụng Công – Ecopark', 'Văn Giang',
];

export const ServiceAreasSection: React.FC<{ props: SectionContentProps }> = ({ props }) => {
  return (
    <section className="py-16 bg-surface-secondary border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-main mb-2">
          {props.heading || 'Khu Vực Phục Vụ Quanh Văn Giang, Hưng Yên'}
        </h2>
        <p className="text-xs sm:text-sm text-text-muted max-w-2xl mx-auto mb-8">
          {props.subheading || 'Khu vực phục vụ: Vinhomes Ocean Park 2–3, Nghĩa Trụ, Như Quỳnh, Phụng Công – Ecopark, Văn Giang và các khu vực lân cận trong bán kính khoảng 10 km từ Dọn Nè'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {AREAS.map((dist, idx) => (
            <div
              key={idx}
              className="rounded-ctrl border border-gray-200 bg-white p-3 text-xs font-semibold text-text-main shadow-sm hover:border-primary transition"
            >
              📍 {dist}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

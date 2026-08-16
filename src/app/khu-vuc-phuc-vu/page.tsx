'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSiteConfig } from '@/components/SiteConfigProvider';

// STATIC TEMPORARY: Dọn Nè has no Location CMS yet (Step 8 planning marked
// per-district content as AFTER V1). This is real Dọn Nè coverage copy, not
// individually-linked district landing pages like the reference site's
// archive (those would require a Location model this project deliberately
// does not add yet — see docs/reference-rebuild/current-vs-reference-gap.md).
//
// Service area relocated: company address is 146 Vịnh Thiên Đường 7, Văn
// Giang, Hưng Yên — coverage list below reflects the real ~10km radius
// around that address, not Hanoi districts.
const AREAS = [
  'Vinhomes Ocean Park 2', 'Vinhomes Ocean Park 3', 'Nghĩa Trụ',
  'Như Quỳnh', 'Phụng Công – Ecopark', 'Văn Giang',
];

export default function ServiceAreasPage() {
  const config = useSiteConfig();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-12 bg-surface-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Phạm Vi Hoạt Động</p>
            <h1 className="text-3xl font-extrabold text-text-main sm:text-4xl">Khu Vực Phục Vụ</h1>
            <p className="mt-3 text-sm text-text-muted">
              Khu vực phục vụ: Vinhomes Ocean Park 2–3, Nghĩa Trụ, Như Quỳnh, Phụng Công – Ecopark, Văn Giang và các
              khu vực lân cận trong bán kính khoảng 10 km từ {config?.brandName ?? 'Dọn Nè'}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {AREAS.map((area) => (
              <div key={area} className="flex flex-col rounded-[20px] border border-gray-200 bg-white p-5 shadow-sm">
                <span className="mb-2 inline-block w-fit rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold text-primary">Khu Vực</span>
                <h3 className="text-sm font-bold text-text-main">{area}</h3>
                <p className="mt-1.5 text-xs text-text-muted">Đội thi công Dọn Nè có mặt nhanh chóng, khảo sát và báo giá miễn phí.</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-primary/20 bg-primary-soft p-6 text-center">
            <p className="text-sm font-semibold text-text-main">Chưa thấy khu vực của bạn?</p>
            <p className="mt-1 text-xs text-text-muted">Gọi hotline để được xác nhận phạm vi phục vụ nhanh nhất.</p>
            {config?.hotlines[0] && (
              <a href={`tel:${config.hotlines[0].replace(/\./g, '')}`} className="mt-4 inline-block rounded-ctrl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-hover">
                Gọi {config.hotlines[0]}
              </a>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

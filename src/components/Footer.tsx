'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSiteConfig } from '@/components/SiteConfigProvider';
import { FloatingContactWidget } from '@/components/FloatingContactWidget';

type FooterService = { slug: string; title: string };

// STATIC TEMPORARY: Dọn Nè has no Location CMS yet (see Step 8 planning —
// deferred AFTER V1). This list is display copy only, not linked to
// individual district pages that don't exist, to avoid broken/fake routes.
//
// Service area relocated: company address is 146 Vịnh Thiên Đường 7, Văn
// Giang, Hưng Yên — reflects the real ~10km radius, not Hanoi districts.
const SERVICE_AREAS = [
  'Vinhomes Ocean Park 2', 'Vinhomes Ocean Park 3', 'Nghĩa Trụ',
  'Như Quỳnh', 'Phụng Công – Ecopark', 'Văn Giang',
];

export const Footer: React.FC = () => {
  const config = useSiteConfig();
  const [services, setServices] = useState<FooterService[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then(async (r) => { if (!r.ok) throw Error(); return r.json(); })
      .then((x) => setServices(x.services.slice(0, 8).map((s: FooterService) => ({ slug: s.slug, title: s.title }))))
      .catch(() => setServices([]));
  }, []);

  if (!config) return <footer className="border-t border-gray-200 bg-surface-secondary px-4 py-12 text-center text-sm text-text-muted"><p role="status">Thông tin liên hệ tạm thời chưa khả dụng.</p></footer>;

  return (
    <>
    <FloatingContactWidget />
    <footer className="bg-text-main pb-20 text-sm text-white md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.45fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5">
              <div className="relative h-8 w-8"><Image src="/logo-web.png" alt={config.brandName} fill className="object-contain" /></div>
              <span className="text-lg font-black text-primary">{config.brandName}</span>
            </Link>
            <p className="mb-3 text-xs leading-relaxed text-white/70">{config.slogan}</p>
            <p className="mb-3 text-xs leading-relaxed text-white/70">{config.footerCommitment}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs">
              Hotline/Zalo: <strong className="text-white">{config.hotlines[0]}</strong>
            </div>
            {(config.socials.facebook || config.socials.tiktok) && (
              <div className="mt-4 flex gap-2">
                {config.socials.facebook && <a href={config.socials.facebook} target="_blank" rel="noreferrer noopener" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877f2] text-xs font-bold text-white transition hover:-translate-y-0.5">f</a>}
                {config.socials.tiktok && <a href={config.socials.tiktok} target="_blank" rel="noreferrer noopener" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs font-bold text-white transition hover:-translate-y-0.5">t</a>}
              </div>
            )}
          </div>

          {/* Services column */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">Dịch Vụ Vệ Sinh</h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              {services.length === 0 && <li><Link href="/dich-vu" className="hover:text-primary">Xem toàn bộ dịch vụ</Link></li>}
              {services.map((s) => <li key={s.slug}><Link href={`/${s.slug}`} className="hover:text-primary">{s.title}</Link></li>)}
            </ul>
          </div>

          {/* Service areas column — STATIC TEMPORARY (no Location CMS yet) */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">Khu Vực Phục Vụ</h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              {SERVICE_AREAS.map((area) => <li key={area}>{area}</li>)}
              <li><Link href="/khu-vuc-phuc-vu" className="font-semibold hover:text-primary">Xem tất cả khu vực →</Link></li>
            </ul>
          </div>

          {/* Info column */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">Thông Tin</h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li><Link href="/gioi-thieu" className="hover:text-primary">Giới thiệu</Link></li>
              <li><Link href="/bang-gia" className="hover:text-primary">Bảng giá</Link></li>
              <li><Link href="/cam-nang-ve-sinh" className="hover:text-primary">Cẩm nang vệ sinh</Link></li>
              <li><Link href="/lien-he" className="hover:text-primary">Liên hệ</Link></li>
              <li><Link href="/chinh-sach-bao-mat" className="hover:text-primary">Chính sách bảo mật</Link></li>
              <li><Link href="/chinh-sach-bao-hanh" className="hover:text-primary">Chính sách bảo hành</Link></li>
            </ul>
            <div className="mt-5 space-y-1.5 border-t border-white/10 pt-4 text-xs text-white/70">
              <p><strong className="text-white">MST:</strong> {config.businessCode}</p>
              <p><strong className="text-white">Email:</strong> {config.emails[0]}</p>
              <p><strong className="text-white">Địa chỉ:</strong> {config.mainAddress}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {config.brandName}. All rights reserved.</p>
          <p>Phục vụ khách hàng cá nhân, doanh nghiệp và cơ sở kinh doanh tại Văn Giang, Hưng Yên và khu vực lân cận.</p>
        </div>
      </div>
    </footer>
    </>
  );
};

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { SectionContentProps } from '@/lib/section-schema';

interface HeroProps {
  props: SectionContentProps;
  onOpenQuote?: () => void;
}

// Round 4 Phase 3: reproduces the reference's large rounded colored-card
// hero geometry (single dark block containing badge + H1 + subheading +
// pill CTAs + image, on top of a plain page background) using Dọn Nè's own
// palette/content — not the reference's blue/orange tokens or copy. Keeps
// items-start + aspect-[4/3] on the image (the fix from the earlier
// whitespace-below-image bug) so that regression is not reintroduced.
export const HeroSection: React.FC<HeroProps> = ({ props, onOpenQuote }) => {
  return (
    <section className="bg-surface pt-8 pb-16 md:pt-12 md:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[28px] bg-text-main px-6 py-10 shadow-xl sm:px-10 sm:py-14 md:px-14">
          {/* flex, not grid: a percentage-height absolutely-positioned <img>
              (next/image `fill`) inside a CSS Grid item whose own height
              comes only from `align-items:stretch` does not reliably
              resolve in Chromium (percentage height stays indefinite across
              the grid sizing algorithm's passes) — the image silently falls
              back to its intrinsic aspect ratio instead of filling the
              column, leaving empty dark space below a shorter image.
              Flexbox's stretch reliably produces a definite used height for
              the flex item, so the same `fill` image resolves correctly. */}
          <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:gap-14">
            {/* Text content: on top on mobile, left column on desktop */}
            <div className="text-center lg:flex-1 lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white mb-6">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                {props.badgeText || 'DỊCH VỤ VỆ SINH CHUYÊN NGHIỆP HÀ NỘI'}
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl max-w-4xl mx-auto lg:mx-0 leading-tight">
                {props.heading || 'Không Gian Sống & Làm Việc'}{' '}
                <span className="text-primary">
                  {props.highlightWord || 'Sạch Tinh Tươm'}
                </span>
              </h1>

              <p className="mt-5 text-sm sm:text-base text-white/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {props.subheading || 'Dọn Nè cung cấp giải pháp tổng vệ sinh nhà ở, vệ sinh sau xây dựng, văn phòng và giặt đệm sofa. Nghiệm thu hài lòng 100% mới thanh toán.'}
              </p>

              {/* CTAs — pill shape, matching reference's rounded-pill CTA group */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={onOpenQuote}
                  className="w-full sm:w-auto rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-primary-hover transition"
                >
                  {props.primaryCtaText || 'Nhận Báo Giá 5 Phút'}
                </button>
                <Link
                  href="/bang-gia"
                  className="w-full sm:w-auto rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/15 transition text-center"
                >
                  {props.secondaryCtaText || 'Xem Bảng Giá 2026'}
                </Link>
              </div>

              {/* Trust Bullets */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto lg:mx-0 text-xs text-text-main font-medium">
                <div className="flex items-center justify-center lg:justify-start gap-2 p-3 bg-white rounded-2xl shadow-sm">
                  <span className="text-primary font-bold">✓</span> Khảo sát & Báo giá minh bạch
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 p-3 bg-white rounded-2xl shadow-sm">
                  <span className="text-primary font-bold">✓</span> Nhân thân nhân viên rõ ràng
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 p-3 bg-white rounded-2xl shadow-sm">
                  <span className="text-primary font-bold">✓</span> Bảo hành hỗ trợ trong 24h
                </div>
              </div>
            </div>

            {/* Hero image: below text on mobile (fixed aspect ratio), right
                column on desktop where it stretches to match the text
                column's height so no empty dark space is left below a
                shorter image. Uses explicit width/height (not `fill`): an
                absolutely-positioned `fill` image with height:100% does not
                reliably resolve against a flex/grid item sized only via
                `stretch` in this Chromium build (confirmed via computed
                style — height stayed at the image's intrinsic aspect ratio
                instead of 100%); an in-flow <img> with h-full does. */}
            <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl shadow-lg lg:mx-0 lg:aspect-auto lg:max-w-none lg:flex-1">
              <Image
                src="/images/home/dn-hero-01.jpeg"
                alt="Nhân viên Dọn Nè thực hiện dịch vụ vệ sinh chuyên nghiệp"
                width={1200}
                height={900}
                priority
                fetchPriority="high"
                quality={100}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

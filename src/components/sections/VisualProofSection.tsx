import React from 'react';
import Image from 'next/image';

const GALLERY: Array<{ src: string; alt: string }> = [
  { src: '/images/home/dn-service-03.jpeg', alt: 'Minh họa dịch vụ vệ sinh sau xây dựng' },
  { src: '/images/home/dn-service-04.jpeg', alt: 'Minh họa dịch vụ vệ sinh văn phòng' },
  { src: '/images/home/dn-service-05.jpeg', alt: 'Minh họa dịch vụ giặt ghế sofa' },
  { src: '/images/home/dn-service-08.jpeg', alt: 'Minh họa dịch vụ lau kính' },
];

/**
 * STATIC PUBLIC ADAPTER — Round 4, Phase 7 ("RealWork" position in the
 * reference homepage).
 *
 * IMPORTANT (per explicit instruction): Dọn Nè's current photo set is
 * AI-generated stock-style photography, not verified photos of real job
 * sites. This section therefore never claims "công trình thực tế" / "khách
 * hàng thực tế" — the heading and caption state plainly that the images are
 * illustrative. Distinct from BeforeAfterSection (existing CMS-controlled
 * section) — no duplicate imagery reused here.
 */
export const VisualProofSection: React.FC = () => {
  return (
    <section className="border-t border-gray-100 bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Hình Ảnh Dịch Vụ</p>
          <h2 className="text-2xl font-extrabold text-text-main sm:text-3xl">Hình Ảnh Minh Họa Dịch Vụ</h2>
          <p className="mt-2 text-xs text-text-muted sm:text-sm">
            Hình ảnh minh họa các hạng mục dịch vụ Dọn Nè cung cấp, chưa phải ảnh chụp trực tiếp tại công trình.
          </p>
        </div>

        {/*
          Bugfix: `fill` (position:absolute + height:100%) does not reliably
          resolve its percentage height against this wrapper in this
          environment — verified via getBoundingClientRect()/computed style:
          the wrapper correctly measured 4:3 (e.g. 296×222) but the <img>
          itself computed to ~164.95px tall (its own intrinsic aspect ratio
          at the rendered width), leaving a gap under wide-ratio source
          photos while the near-4:3 photo showed almost no gap — exactly the
          reported symptom. Same root cause/fix as HeroSection.tsx: use
          explicit width/height + h-full w-full object-cover instead of
          `fill`, which reliably respects the wrapper's aspect-ratio box.
        */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {GALLERY.map((img) => (
            <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-[20px] shadow-sm">
              <Image
                src={img.src}
                alt={img.alt}
                width={800}
                height={600}
                quality={100}
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

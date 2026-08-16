import React from 'react';
import Image from 'next/image';

interface PageBannerProps {
  caption: string;
  image: string;
  imageAlt: string;
}

/**
 * Round 4.2 — reference page-shell adapter for content pages (/bang-gia,
 * /gioi-thieu, /lien-he). The reference site (WP `page` template) renders
 * each of these pages as: plain H1 → large rounded banner photo → short
 * intro paragraph → the page's own content — confirmed by opening the real
 * reference pages, not inferred from CSS alone. This component is only the
 * banner-photo piece of that shell (the H1 stays owned by each page, above
 * this component, matching reference order); it carries a small caption
 * chip using real Dọn Nè brand text (never invented stats/awards/years).
 * Geometry (radius, min-height ratio) matches `.intro-image-card` tokens
 * recorded in docs/reference-rebuild/ui-forensic-inventory.md. No reference
 * image or wording is reused.
 */
export const PageBanner: React.FC<PageBannerProps> = ({ caption, image, imageAlt }) => {
  return (
    <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-[28px] shadow-lg sm:aspect-[21/9]">
      <Image src={image} alt={imageAlt} fill quality={100} sizes="(min-width: 1024px) 860px, 100vw" className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-text-main/80 via-text-main/10 to-transparent" />
      <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-text-main shadow sm:bottom-6 sm:left-6">
        {caption}
      </div>
    </div>
  );
};

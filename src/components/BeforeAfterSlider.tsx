'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface BeforeAfterImage {
  src: string;
  alt: string;
}

interface BeforeAfterItem {
  title: string;
  category: string;
  beforeLabel: string;
  afterLabel: string;
  beforeDesc: string;
  afterDesc: string;
  beforeImage?: BeforeAfterImage;
  afterImage?: BeforeAfterImage;
}

const ITEMS: BeforeAfterItem[] = [
  {
    title: 'Sàn gạch bám keo & sơn sau xây dựng',
    category: 'Vệ sinh sau xây dựng',
    beforeLabel: 'Trước thi công',
    afterLabel: 'Sau thi công',
    beforeDesc: 'Vệt sơn tường khô ráp, bụi xi măng mịn len lỏi trong mạch gạch.',
    afterDesc: 'Sàn sáng bóng, đường ron trắng sạch, khử sạch hoàn toàn bụi mịn.'
  },
  {
    title: 'Ghế sofa bám bẩn & ố vàng',
    category: 'Giặt đệm & Sofa',
    beforeLabel: 'Trước vệ sinh',
    afterLabel: 'Sau vệ sinh',
    beforeDesc: 'Ố vàng do mồ hôi lâu ngày, có mùi ẩm khó chịu.',
    afterDesc: 'Phun hút nước nóng 140°C tẩy sạch vết ố, thơm tinh dầu tự nhiên.',
    beforeImage: { src: '/images/home/dn-before-01.jpeg', alt: 'Ghế sofa trước khi Dọn Nè vệ sinh' },
    afterImage: { src: '/images/home/dn-after-01.jpeg', alt: 'Ghế sofa sau khi Dọn Nè vệ sinh' },
  },
  {
    title: 'Kính mặt dựng ngoài trời bám vảy canxi',
    category: 'Lau kính tòa nhà',
    beforeLabel: 'Kính cũ mờ đục',
    afterLabel: 'Kính sau gạt sạch',
    beforeDesc: 'Kính bị bám ố mưa axit và bụi đường xá dày đặc.',
    afterDesc: 'Kính trong suốt tuyệt đối, phủ lớp nano chống đọng nước.'
  }
];

export const BeforeAfterSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = ITEMS[activeIndex];

  return (
    <div className="rounded-card bg-white p-6 border border-gray-200 shadow-sm">
      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-3 mb-4 overflow-x-auto">
        {ITEMS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`whitespace-nowrap rounded-ctrl px-3 py-1.5 text-xs font-semibold transition ${
              activeIndex === idx
                ? 'bg-primary text-white'
                : 'bg-surface-secondary text-text-muted hover:text-text-main'
            }`}
          >
            {item.category}
          </button>
        ))}
      </div>

      <h4 className="text-sm font-bold text-text-main mb-4">{current.title}</h4>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before Box */}
        <div className="overflow-hidden rounded-ctrl border border-red-200 bg-red-50/50">
          {current.beforeImage && (
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={current.beforeImage.src}
                alt={current.beforeImage.alt}
                fill
                quality={100}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 uppercase">
                {current.beforeLabel}
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              {current.beforeDesc}
            </p>
          </div>
        </div>

        {/* After Box */}
        <div className="overflow-hidden rounded-ctrl border border-primary/30 bg-primary-soft/50">
          {current.afterImage && (
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={current.afterImage.src}
                alt={current.afterImage.alt}
                fill
                quality={100}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded bg-primary text-white px-2 py-0.5 text-[10px] font-bold uppercase">
                {current.afterLabel}
              </span>
            </div>
            <p className="text-xs text-text-main font-medium leading-relaxed">
              {current.afterDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

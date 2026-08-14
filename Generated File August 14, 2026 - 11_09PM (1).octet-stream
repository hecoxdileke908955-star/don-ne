'use client';

import React from 'react';
import { FALLBACK_SITE_CONFIG } from '@/lib/global-settings';
import { trackClientEvent } from '@/lib/traffic-tracker';

interface MobileStickyBarProps {
  onOpenQuote?: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onOpenQuote }) => {
  const config = FALLBACK_SITE_CONFIG;

  const handlePhoneClick = () => {
    trackClientEvent('phone_click', { hotline: config.hotlines[0], location: 'mobile_sticky' });
  };

  const handleZaloClick = () => {
    trackClientEvent('zalo_click', { zalo: config.zaloNumbers[0], location: 'mobile_sticky' });
  };

  return (
    <aside aria-label="Thanh liên hệ nhanh di động" className="fixed bottom-0 left-0 right-0 z-40 block border-t border-gray-200 bg-white/95 px-3 py-2 backdrop-blur-md md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-md items-center justify-between gap-2">
        <a
          href={`tel:${config.hotlines[0].replace(/\./g, '')}`}
          onClick={handlePhoneClick}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-ctrl border border-primary bg-white py-2.5 text-center text-xs font-bold text-primary active:bg-primary-soft"
        >
          📞 GỌI NGAY
        </a>

        <a
          href={`https://zalo.me/${config.zaloNumbers[0]}`}
          target="_blank"
          rel="noreferrer"
          onClick={handleZaloClick}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-ctrl bg-[#0068FF] py-2.5 text-center text-xs font-bold text-white shadow-sm active:bg-blue-700"
        >
          💬 ZALO GỬI ẢNH
        </a>

        <button
          onClick={onOpenQuote}
          className="flex flex-1 items-center justify-center gap-1 rounded-ctrl bg-primary py-2.5 text-center text-xs font-bold text-white shadow-sm active:bg-primary-hover"
        >
          📋 BÁO GIÁ
        </button>
      </div>
    </aside>
  );
};

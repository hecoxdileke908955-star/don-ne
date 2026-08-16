'use client';

import React from 'react';
import { useSiteConfig } from '@/components/SiteConfigProvider';
import { trackClientEvent } from '@/lib/traffic-tracker';

/**
 * Desktop-only floating contact card (hidden on mobile — MobileStickyBar
 * already covers that surface, per "no two overlapping widgets"). Geometry
 * mirrors the reference site's fixed bottom-right contact card; phone/Zalo
 * numbers come from Dọn Nè's own GlobalSetting, never hard-coded.
 */
export const FloatingContactWidget: React.FC = () => {
  const config = useSiteConfig();
  const hotline = config?.hotlines[0];
  const zaloNumber = config?.zaloNumbers[0];

  if (!hotline && !zaloNumber) return null;

  return (
    <div className="fixed bottom-24 right-5 z-40 hidden w-[245px] rounded-[22px] border border-primary/10 bg-white/95 p-3.5 shadow-2xl backdrop-blur-sm lg:block">
      <div className="mb-3 flex items-center gap-2.5 border-b border-gray-100 pb-3">
        <span className="relative flex h-2.5 w-2.5 shrink-0 rounded-full bg-green-500 shadow-[0_0_0_6px_rgba(34,197,94,0.15)]" />
        <div className="leading-tight">
          <strong className="block text-sm font-extrabold text-text-main">Cần tư vấn dịch vụ?</strong>
          <small className="text-[11px] text-text-muted">{config?.brandName ?? 'Dọn Nè'} hỗ trợ nhanh</small>
        </div>
      </div>

      <div className="grid gap-2.5">
        {hotline && (
          <a
            href={`tel:${hotline.replace(/\./g, '')}`}
            onClick={() => trackClientEvent('phone_click', { hotline, location: 'floating_widget' })}
            className="flex min-h-[56px] items-center gap-2.5 rounded-2xl bg-primary px-3 py-2.5 text-white transition hover:brightness-105"
          >
            <span className="text-lg" aria-hidden="true">📞</span>
            <span className="leading-tight">
              <strong className="block text-xs font-extrabold">Gọi ngay</strong>
              <small className="text-[11px] opacity-90">{hotline}</small>
            </span>
          </a>
        )}
        {zaloNumber && (
          <a
            href={`https://zalo.me/${zaloNumber}`}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => trackClientEvent('zalo_click', { zalo: zaloNumber, location: 'floating_widget' })}
            className="flex min-h-[56px] items-center gap-2.5 rounded-2xl bg-[#0068FF] px-3 py-2.5 text-white transition hover:brightness-105"
          >
            <span className="flex h-[18px] w-[18px] items-center justify-center text-xs font-black" aria-hidden="true">Z</span>
            <span className="leading-tight">
              <strong className="block text-xs font-extrabold">Nhắn Zalo</strong>
              <small className="text-[11px] opacity-90">Gửi ảnh báo giá nhanh</small>
            </span>
          </a>
        )}
      </div>
    </div>
  );
};

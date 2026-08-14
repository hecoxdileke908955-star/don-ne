'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSiteConfig } from '@/components/SiteConfigProvider';
import { trackClientEvent } from '@/lib/traffic-tracker';

interface HeaderProps { onOpenQuote?: () => void; }

export const Header: React.FC<HeaderProps> = ({ onOpenQuote }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const config = useSiteConfig();
  const hotline = config?.hotlines[0];
  const phoneHref = hotline ? `tel:${hotline.replace(/\./g, '')}` : undefined;
  const handlePhoneClick = () => { if (hotline) trackClientEvent('phone_click', { hotline, location: 'header' }); };

  return <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
      <Link href="/" className="flex items-center gap-2">
        <div className="relative h-10 w-10 overflow-hidden rounded-lg"><Image src="/logo-web.png" alt={config?.brandName ? `${config.brandName} Logo` : 'Logo'} fill className="object-contain" priority /></div>
        <div>{config ? <><span className="text-xl font-black tracking-tight text-primary">{config.brandName}</span><span className="hidden sm:block text-[10px] font-medium text-text-muted">{config.slogan}</span></> : <span className="text-xs font-medium text-text-muted">Thông tin tạm thời chưa khả dụng</span>}</div>
      </Link>
      <nav className="hidden items-center gap-6 text-sm font-medium text-text-main md:flex">
        <Link href="/dich-vu" className="transition hover:text-primary">Dịch Vụ</Link><Link href="/bang-gia" className="transition hover:text-primary">Bảng Giá 2026</Link>
      </nav>
      <div className="hidden items-center gap-3 md:flex">
        {phoneHref && <a href={phoneHref} onClick={handlePhoneClick} className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-primary">📞</span><span>{hotline}</span></a>}
        <button onClick={onOpenQuote} className="rounded-ctrl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-primary-hover">Nhận Báo Giá 5 Phút</button>
      </div>
      <div className="flex items-center gap-2 md:hidden"><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 text-text-main hover:bg-surface-secondary" aria-label="Menu">{mobileMenuOpen ? '✕' : '☰'}</button></div>
    </div>
    {mobileMenuOpen && <div className="space-y-3 border-t border-gray-100 bg-white px-4 py-4 text-sm md:hidden">
      {[['/dich-vu', 'Dịch Vụ'], ['/bang-gia', 'Bảng Giá 2026']].map(([href, label]) => <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="block py-1.5 font-medium text-text-main">{label}</Link>)}
      <div className="flex flex-col gap-2 border-t border-gray-100 pt-2">{phoneHref && <a href={phoneHref} onClick={handlePhoneClick} className="block rounded-ctrl bg-primary-soft py-2.5 text-center font-bold text-primary">Gọi Hotline: {hotline}</a>}</div>
    </div>}
  </header>;
};

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSiteConfig } from '@/components/SiteConfigProvider';
import { trackClientEvent } from '@/lib/traffic-tracker';
import { HiddenAdminEntryLogo } from '@/components/HiddenAdminEntryLogo';

interface HeaderProps { onOpenQuote?: () => void; }
type NavService = { slug: string; title: string };

// Reference site nav order (Trang chủ / Dịch vụ▼ / Bảng giá / Khu vực / Cẩm nang / Giới thiệu / Liên hệ).
const NAV_LINKS: Array<{ href: string; label: string }> = [
  { href: '/bang-gia', label: 'Bảng Giá' },
  { href: '/khu-vuc-phuc-vu', label: 'Khu Vực' },
  { href: '/cam-nang-ve-sinh', label: 'Cẩm Nang' },
  { href: '/gioi-thieu', label: 'Giới Thiệu' },
  { href: '/lien-he', label: 'Liên Hệ' },
];

// onOpenQuote is intentionally unused in the header (reference nav only
// exposes a Gọi/Zalo CTA there); the prop is kept so existing callers that
// pass it (e.g. the homepage quote modal trigger) remain source-compatible.
export const Header: React.FC<HeaderProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [services, setServices] = useState<NavService[]>([]);
  const config = useSiteConfig();
  const hotline = config?.hotlines[0];
  const phoneHref = hotline ? `tel:${hotline.replace(/\./g, '')}` : undefined;
  const handlePhoneClick = () => { if (hotline) trackClientEvent('phone_click', { hotline, location: 'header' }); };

  useEffect(() => {
    fetch('/api/services')
      .then(async (r) => { if (!r.ok) throw Error(); return r.json(); })
      .then((x) => setServices(x.services.map((s: NavService) => ({ slug: s.slug, title: s.title }))))
      .catch(() => setServices([]));
  }, []);

  return <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
      <HiddenAdminEntryLogo className="flex shrink-0 items-center gap-2 select-none">
        {/* logo-web.png is the full vertical brand LOCKUP (house mark +
            sparkles + the embedded wordmark "DỌN NÈ" + a broom flourish) —
            not a standalone brand mark meant to sit beside the "Dọn Nè"
            text label that's already rendered next to it below. Squeezing
            that whole lockup into any navbar-height box necessarily shrinks
            its widest, most identifying element (the house icon) down to a
            sliver, which is why it kept reading as a favicon-sized dot no
            matter how much the box grew.
            logo-mark.png is a plain crop of that same source file — just
            the house/chimney/sparkles/underline-arc region, with the
            embedded "DỌN NÈ" text and broom cropped out (no redraw, no AI,
            no upscale) — at its native 492x271 (~1.815:1) aspect ratio. The
            wrapper below is sized to that ratio, not forced square, so the
            house icon itself renders large and legible at navbar height. */}
        <div className="relative h-[40px] w-[73px] overflow-hidden lg:h-[44px] lg:w-[80px]"><Image src="/logo-mark.png" alt={config?.brandName ? `${config.brandName} Logo` : 'Logo'} fill className="object-contain" priority /></div>
        <div>{config ? <><span className="text-xl font-black tracking-tight text-primary">{config.brandName}</span><span className="hidden sm:block text-[10px] font-medium text-text-muted">{config.slogan}</span></> : <span className="text-xs font-medium text-text-muted">Thông tin tạm thời chưa khả dụng</span>}</div>
      </HiddenAdminEntryLogo>

      <nav className="hidden items-center gap-6 text-sm font-medium text-text-main lg:flex">
        <Link href="/" className="transition hover:text-primary">Trang Chủ</Link>

        <div className="group relative">
          <Link href="/dich-vu" className="flex items-center gap-1 rounded transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Dịch Vụ <span aria-hidden="true" className="text-[10px] transition group-hover:rotate-180">▼</span>
          </Link>
          {services.length > 0 && (
            <div className="invisible absolute left-1/2 top-full z-50 mt-2.5 min-w-[240px] -translate-x-1/2 rounded-2xl border border-gray-100 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/${s.slug}`}
                  className="block whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-semibold text-text-main hover:bg-primary-soft hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="transition hover:text-primary">{link.label}</Link>
        ))}
      </nav>

      <div className="hidden items-center gap-3 lg:flex">
        {phoneHref && <a href={phoneHref} onClick={handlePhoneClick} className="rounded-full bg-primary px-5 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-primary-hover">Gọi / Zalo</a>}
      </div>

      <div className="flex items-center gap-2 lg:hidden"><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 text-text-main hover:bg-surface-secondary" aria-label="Menu" aria-expanded={mobileMenuOpen}>{mobileMenuOpen ? '✕' : '☰'}</button></div>
    </div>

    {mobileMenuOpen && <div className="space-y-1 border-t border-gray-100 bg-white px-4 py-4 text-sm lg:hidden">
      <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 font-medium text-text-main">Trang Chủ</Link>
      <Link href="/dich-vu" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 font-medium text-text-main">Dịch Vụ</Link>
      {services.length > 0 && (
        <div className="ml-3 space-y-1 border-l border-gray-100 pl-3">
          {services.map((s) => (
            <Link key={s.slug} href={`/${s.slug}`} onClick={() => setMobileMenuOpen(false)} className="block py-1 text-xs font-semibold text-text-muted hover:text-primary">{s.title}</Link>
          ))}
        </div>
      )}
      {NAV_LINKS.map((link) => (
        <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block py-1.5 font-medium text-text-main">{link.label}</Link>
      ))}
      <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">{phoneHref && <a href={phoneHref} onClick={handlePhoneClick} className="block rounded-ctrl bg-primary-soft py-2.5 text-center font-bold text-primary">Gọi Hotline: {hotline}</a>}</div>
    </div>}
  </header>;
};

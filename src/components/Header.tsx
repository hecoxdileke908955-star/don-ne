'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FALLBACK_SITE_CONFIG } from '@/lib/global-settings';
import { trackClientEvent } from '@/lib/traffic-tracker';

interface HeaderProps {
  onOpenQuote?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuote }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const config = FALLBACK_SITE_CONFIG;

  const handlePhoneClick = () => {
    trackClientEvent('phone_click', { hotline: config.hotlines[0], location: 'header' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg">
            <Image
              src="/logo-web.png"
              alt="Dọn Nè Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-primary">DỌN NÈ</span>
            <span className="hidden sm:block text-[10px] font-medium text-text-muted">
              Vệ Sinh Chuyên Nghiệp Hà Nội
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex text-sm font-medium text-text-main">
          <Link href="/dich-vu" className="hover:text-primary transition">
            Dịch Vụ
          </Link>
          <Link href="/bang-gia" className="hover:text-primary transition">
            Bảng Giá 2026
          </Link>
          <Link href="/khu-vuc" className="hover:text-primary transition">
            Khu Vực Phục Vụ
          </Link>
          <Link href="/cam-nang" className="hover:text-primary transition">
            Cẩm Nang
          </Link>
          <Link href="/gioi-thieu" className="hover:text-primary transition">
            Giới Thiệu
          </Link>
          <Link href="/lien-he" className="hover:text-primary transition">
            Liên Hệ
          </Link>
        </nav>

        {/* CTA & Hotline Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${config.hotlines[0].replace(/\./g, '')}`}
            onClick={handlePhoneClick}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-primary">
              📞
            </span>
            <span>{config.hotlines[0]}</span>
          </a>
          <button
            onClick={onOpenQuote}
            className="rounded-ctrl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition"
          >
            Nhận Báo Giá 5 Phút
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-text-main hover:bg-surface-secondary rounded-lg"
            aria-label="Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden text-sm space-y-3">
          <Link
            href="/dich-vu"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-medium text-text-main"
          >
            Dịch Vụ
          </Link>
          <Link
            href="/bang-gia"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-medium text-text-main"
          >
            Bảng Giá 2026
          </Link>
          <Link
            href="/khu-vuc"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-medium text-text-main"
          >
            Khu Vực Phục Vụ
          </Link>
          <Link
            href="/cam-nang"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-medium text-text-main"
          >
            Cẩm Nang Vệ Sinh
          </Link>
          <Link
            href="/gioi-thieu"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-medium text-text-main"
          >
            Giới Thiệu
          </Link>
          <Link
            href="/lien-he"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 font-medium text-text-main"
          >
            Liên Hệ
          </Link>
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <a
              href={`tel:${config.hotlines[0].replace(/\./g, '')}`}
              onClick={handlePhoneClick}
              className="block rounded-ctrl bg-primary-soft py-2.5 text-center font-bold text-primary"
            >
              Gọi Hotline: {config.hotlines[0]}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

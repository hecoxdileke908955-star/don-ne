'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSiteConfig } from '@/components/SiteConfigProvider';

export default function ThankYouPage() {
  const zaloNumber = useSiteConfig()?.zaloNumbers[0];
  return <div className="flex min-h-screen flex-col justify-between"><Header /><main className="flex flex-1 items-center justify-center bg-surface-secondary px-4 py-16"><div className="w-full max-w-md rounded-card border border-gray-200 bg-white p-8 text-center shadow-lg"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-3xl text-primary">✓</div><span className="text-xs font-bold uppercase tracking-wider text-primary">Tiếp Nhận Thành Công</span><h1 className="mt-1 text-2xl font-bold text-text-main">Cảm Ơn Quý Khách!</h1><p className="mt-3 text-xs leading-relaxed text-text-muted">Hệ thống đã ghi nhận yêu cầu báo giá. Chuyên viên kỹ thuật sẽ gọi lại trong vòng <strong>5 phút</strong>.</p><div className="mt-6 flex flex-col gap-2">{zaloNumber && <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noreferrer" className="rounded-ctrl bg-[#0068FF] py-3 text-xs font-bold text-white shadow transition hover:bg-blue-700">💬 Nhắn Zalo Gửi Thêm Ảnh Hiện Trạng</a>}<Link href="/" className="rounded-ctrl border border-gray-300 py-2.5 text-xs font-semibold text-text-main transition hover:bg-surface-secondary">Về Trang Chủ</Link></div></div></main><Footer /></div>;
}

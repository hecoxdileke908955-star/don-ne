'use client';

import React from 'react';
import { useSiteConfig } from '@/components/SiteConfigProvider';
import type { SectionContentProps } from '@/lib/section-schema';

export const CTASection: React.FC<{ props: SectionContentProps; onOpenQuote?: () => void }> = ({ props, onOpenQuote }) => {
  const hotline = useSiteConfig()?.hotlines[0];
  return <section className="bg-primary py-14 text-white"><div className="mx-auto max-w-5xl px-4 text-center sm:px-6"><h2 className="mb-3 text-2xl font-extrabold sm:text-4xl">{props.heading || 'Đặt Lịch Dọn Dẹp Hôm Nay — Nhận Ưu Đãi Đầu Tuần'}</h2><p className="mx-auto mb-6 max-w-2xl text-xs leading-relaxed text-primary-soft sm:text-sm">{props.subheading || 'Liên hệ qua Hotline hoặc Zalo để nhân viên tư vấn gửi phương án tối ưu trong 5 phút.'}</p><div className="flex flex-col items-center justify-center gap-4 sm:flex-row">{hotline ? <a href={`tel:${hotline.replace(/\./g, '')}`} className="w-full rounded-ctrl bg-white px-6 py-3 text-xs font-bold text-primary shadow transition hover:bg-gray-100 sm:w-auto">📞 GỌI HOTLINE: {hotline}</a> : <p className="text-xs text-primary-soft">Thông tin liên hệ tạm thời chưa khả dụng.</p>}<button onClick={onOpenQuote} className="w-full rounded-ctrl border border-white/40 bg-primary-hover px-6 py-3 text-xs font-bold text-white shadow transition hover:bg-primary-hover/80 sm:w-auto">📋 NHẬN BÁO GIÁ NHANH</button></div></div></section>;
};

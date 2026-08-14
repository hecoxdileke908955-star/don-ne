'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { QuoteFormModal } from '@/components/QuoteFormModal';
import { PricingCalculator } from '@/components/PricingCalculator';
import { formatVND } from '@/lib/pricing-engine';

const CATEGORIES = ['Tất cả', 'Nhà ở & Căn hộ', 'Doanh nghiệp & Xây dựng', 'Giặt ghế & Nội thất', 'Sàn & Kính', 'Dịch vụ chuyên sâu'];

type PublicPriceItem = {
  id: string;
  cat: string;
  name: string;
  unit: string;
  min: number;
  max: number | null;
  condition: string;
  note: string;
};

export default function PricingPage() {
  const [selectedCat, setSelectedCat] = useState('Tất cả');
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [items, setItems] = useState<PublicPriceItem[]>([]);
  const [pricingUnavailable, setPricingUnavailable] = useState(false);

  useEffect(() => {
    fetch('/api/pricing')
      .then(async (response) => {
        if (!response.ok) throw new Error('Pricing unavailable');
        return response.json();
      })
      .then((data) => setItems(data.items.map((item: { id: string; itemName: string; unit: string; minPrice: string | number; maxPrice: string | number | null; conditionText: string | null; note: string | null; service: { category: { name: string } } }) => ({
        id: item.id,
        cat: item.service.category.name,
        name: item.itemName,
        unit: item.unit,
        min: Number(item.minPrice),
        max: item.maxPrice === null ? null : Number(item.maxPrice),
        condition: item.conditionText ?? '',
        note: item.note ?? '',
      }))))
      .catch(() => setPricingUnavailable(true));
  }, []);

  const filteredItems = items.filter((item) => selectedCat === 'Tất cả' || item.cat === selectedCat);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header onOpenQuote={() => setIsQuoteOpen(true)} />
      <main className="flex-1 py-12 bg-surface-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="rounded bg-primary-soft px-3 py-1 text-xs font-bold text-primary">CẬP NHẬT 2026</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main mt-3">Bảng Giá Dịch Vụ Vệ Sinh Dọn Nè</h1>
            <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed">Bảng giá niêm yết công khai, minh bạch. Đọc trực tiếp từ hệ thống quản lý giá tập trung (Single Source of Truth), cam kết không phát sinh bất kỳ khoản phụ phí nào ngoài hợp đồng.</p>
          </div>

          <div className="mb-10"><PricingCalculator /></div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setSelectedCat(cat)} className={`whitespace-nowrap rounded-ctrl px-4 py-2 text-xs font-semibold transition ${selectedCat === cat ? 'bg-primary text-white shadow-sm' : 'bg-white text-text-muted border border-gray-200 hover:text-text-main'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-card border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs text-text-main">
              <thead className="border-b border-gray-200 bg-surface-secondary text-[11px] font-bold uppercase text-text-muted">
                <tr><th className="px-4 py-3.5">Hạng Mục Dịch Vụ</th><th className="px-4 py-3.5">Đơn vị</th><th className="px-4 py-3.5">Đơn Giá Niêm Yết</th><th className="px-4 py-3.5 hidden md:table-cell">Điều Kiện Áp Dụng</th><th className="px-4 py-3.5 text-right">Tác Vụ</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pricingUnavailable && <tr><td className="px-4 py-8 text-center text-text-muted" colSpan={5}>Bảng giá tạm thời chưa khả dụng.</td></tr>}
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-3.5"><div className="font-bold text-text-main">{item.name}</div><div className="text-[11px] text-text-muted mt-0.5">{item.note}</div></td>
                    <td className="px-4 py-3.5 font-medium text-text-muted">{item.unit}</td>
                    <td className="px-4 py-3.5 font-bold text-primary whitespace-nowrap">{item.max === null || item.min === item.max ? formatVND(item.min) : `${item.min.toLocaleString('vi-VN')} – ${item.max.toLocaleString('vi-VN')}đ`}</td>
                    <td className="px-4 py-3.5 text-text-muted hidden md:table-cell">{item.condition}</td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap"><button onClick={() => setIsQuoteOpen(true)} className="rounded-ctrl bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition">Đặt Lịch</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
      <MobileStickyBar onOpenQuote={() => setIsQuoteOpen(true)} />
      <QuoteFormModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}

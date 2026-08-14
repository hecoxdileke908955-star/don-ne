'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { QuoteFormModal } from '@/components/QuoteFormModal';
import { PricingCalculator } from '@/components/PricingCalculator';
import { formatVND } from '@/lib/pricing-engine';

const CATEGORIES = [
  'Tất cả',
  'Nhà ở & Căn hộ',
  'Doanh nghiệp & Xây dựng',
  'Giặt ghế & Nội thất',
  'Sàn & Kính',
  'Dịch vụ chuyên sâu'
];

const PRICING_ITEMS = [
  { id: '1', cat: 'Nhà ở & Căn hộ', name: 'Tổng vệ sinh căn hộ chung cư 1 PN (< 55m²)', unit: 'Gói', min: 800000, max: 1000000, condition: 'Hút bụi mịn, lau kính trong, cọ toilet', note: 'Bao gồm trọn bộ trang thiết bị và hóa chất' },
  { id: '2', cat: 'Nhà ở & Căn hộ', name: 'Tổng vệ sinh căn hộ chung cư 2 PN (55 – 85m²)', unit: 'Gói', min: 1100000, max: 1400000, condition: '2 phòng ngủ, 2 WC, bếp, ban công', note: 'Đội thợ 3-4 người làm trong 3-4 tiếng' },
  { id: '3', cat: 'Nhà ở & Căn hộ', name: 'Tổng vệ sinh căn hộ chung cư 3 PN (85 – 120m²)', unit: 'Gói', min: 1500000, max: 1900000, condition: 'Toàn bộ nội thất và khu sinh hoạt', note: 'Lau sạch sâu dầu mỡ bếp và cặn canxi kính tắm' },
  { id: '4', cat: 'Nhà ở & Căn hộ', name: 'Tổng vệ sinh nhà phố, biệt thự nhiều tầng', unit: 'm²', min: 12000, max: 18000, condition: 'Tính theo diện tích sàn thực tế', note: 'Áp dụng cho nhà đang ở hoặc trước khi dọn về' },
  { id: '5', cat: 'Doanh nghiệp & Xây dựng', name: 'Vệ sinh công trình sau xây dựng', unit: 'm²', min: 15000, max: 22000, condition: 'Sủi sơn, keo dán thảm, bụi xi măng', note: 'Máy hút bụi công nghiệp 3 mô-tơ chuyên dụng' },
  { id: '6', cat: 'Doanh nghiệp & Xây dựng', name: 'Vệ sinh văn phòng định kỳ cuối tuần', unit: 'm²', min: 8000, max: 15000, condition: 'Làm ngoài giờ hành chính', note: 'Không làm gián đoạn giờ làm việc của công ty' },
  { id: '7', cat: 'Giặt ghế & Nội thất', name: 'Giặt sofa nỉ / vải văng đơn', unit: 'Bộ', min: 250000, max: 350000, condition: 'Phun hút nước nóng diệt khuẩn', note: 'Sấy khô nhanh trong 60-90 phút' },
  { id: '8', cat: 'Giặt ghế & Nội thất', name: 'Giặt đệm cao su thiên nhiên / lò xo', unit: 'Chiếc', min: 300000, max: 450000, condition: 'Tẩy ố vàng, diệt mạt bụi 99.9%', note: 'Xịt tinh dầu thảo mộc dịu nhẹ' },
  { id: '9', cat: 'Giặt ghế & Nội thất', name: 'Giặt thảm văn phòng diện tích lớn (> 100m²)', unit: 'm²', min: 8000, max: 14000, condition: 'Máy chà mâm xoay công nghiệp', note: 'Hóa chất tạo bọt nhanh khô' },
  { id: '10', cat: 'Sàn & Kính', name: 'Lau kính mặt ngoài tòa nhà (đu dây)', unit: 'm²', min: 15000, max: 28000, condition: 'Có bảo hiểm và thợ chứng chỉ an toàn', note: 'Tẩy vảy cá và ố mốc lâu ngày trên kính' },
  { id: '11', cat: 'Dịch vụ chuyên sâu', name: 'Vệ sinh & bảo dưỡng sân Pickleball', unit: 'Sân', min: 1200000, max: 2000000, condition: 'Sân tiêu chuẩn kèm khu viền biên', note: 'Máy xịt rửa áp lực cao không làm bong tróc sơn' },
];

export default function PricingPage() {
  const [selectedCat, setSelectedCat] = useState('Tất cả');
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const filteredItems = PRICING_ITEMS.filter(
    (item) => selectedCat === 'Tất cả' || item.cat === selectedCat
  );

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header onOpenQuote={() => setIsQuoteOpen(true)} />
      
      <main className="flex-1 py-12 bg-surface-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="rounded bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
              CẬP NHẬT 2026
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main mt-3">
              Bảng Giá Dịch Vụ Vệ Sinh Dọn Nè
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed">
              Bảng giá niêm yết công khai, minh bạch. Đọc trực tiếp từ hệ thống quản lý giá tập trung (Single Source of Truth), cam kết không phát sinh bất kỳ khoản phụ phí nào ngoài hợp đồng.
            </p>
          </div>

          <div className="mb-10">
            <PricingCalculator />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`whitespace-nowrap rounded-ctrl px-4 py-2 text-xs font-semibold transition ${
                  selectedCat === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-text-muted border border-gray-200 hover:text-text-main'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-card border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs text-text-main">
              <thead className="border-b border-gray-200 bg-surface-secondary text-[11px] font-bold uppercase text-text-muted">
                <tr>
                  <th className="px-4 py-3.5">Hạng Mục Dịch Vụ</th>
                  <th className="px-4 py-3.5">Đơn vị</th>
                  <th className="px-4 py-3.5">Đơn Giá Niêm Yết</th>
                  <th className="px-4 py-3.5 hidden md:table-cell">Điều Kiện Áp Dụng</th>
                  <th className="px-4 py-3.5 text-right">Tác Vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-text-main">{item.name}</div>
                      <div className="text-[11px] text-text-muted mt-0.5">{item.note}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-text-muted">{item.unit}</td>
                    <td className="px-4 py-3.5 font-bold text-primary whitespace-nowrap">
                      {item.min === item.max
                        ? formatVND(item.min)
                        : `${item.min.toLocaleString('vi-VN')} – ${item.max.toLocaleString('vi-VN')}đ`}
                    </td>
                    <td className="px-4 py-3.5 text-text-muted hidden md:table-cell">
                      {item.condition}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setIsQuoteOpen(true)}
                        className="rounded-ctrl bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition"
                      >
                        Đặt Lịch
                      </button>
                    </td>
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

'use client';

import React, { useState } from 'react';
import { formatVND } from '@/lib/pricing-engine';

interface ServiceOption {
  id: string;
  name: string;
  unit: string;
  basePrice: number;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  { id: 'opt-1', name: 'Tổng vệ sinh căn hộ chung cư', unit: 'm²', basePrice: 15000 },
  { id: 'opt-2', name: 'Vệ sinh sau xây dựng', unit: 'm²', basePrice: 18000 },
  { id: 'opt-3', name: 'Vệ sinh văn phòng định kỳ', unit: 'm²', basePrice: 10000 },
  { id: 'opt-4', name: 'Giặt ghế sofa', unit: 'Bộ', basePrice: 350000 },
  { id: 'opt-5', name: 'Giặt đệm cao su / lò xo', unit: 'Chiếc', basePrice: 300000 },
  { id: 'opt-6', name: 'Giặt thảm văn phòng', unit: 'm²', basePrice: 12000 },
];

export const PricingCalculator: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICE_OPTIONS[0].id);
  const [quantity, setQuantity] = useState<number>(75);

  const selected = SERVICE_OPTIONS.find((s) => s.id === selectedServiceId) || SERVICE_OPTIONS[0];
  const total = selected.basePrice * quantity;

  return (
    <div className="rounded-card bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-text-main">Ước Tính Chi Phí Nhanh</h3>
          <p className="text-xs text-text-muted">Công cụ tính giá dự kiến dựa trên đơn giá chuẩn Dọn Nè</p>
        </div>
        <span className="rounded bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
          ĐƠN GIÁ 2026
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-text-main mb-1">
            Chọn loại dịch vụ
          </label>
          <select
            value={selectedServiceId}
            onChange={(e) => {
              setSelectedServiceId(e.target.value);
              if (e.target.value === 'opt-4' || e.target.value === 'opt-5') {
                setQuantity(1);
              } else if (quantity < 10) {
                setQuantity(75);
              }
            }}
            className="w-full rounded-ctrl border border-gray-300 px-3 py-2 text-xs focus:border-primary focus:outline-none"
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name} ({formatVND(opt.basePrice)} / {opt.unit})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-main mb-1">
            Số lượng / Diện tích ({selected.unit})
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-ctrl border border-gray-300 px-3 py-2 text-xs focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-ctrl bg-surface-secondary p-4 border border-gray-200">
        <div>
          <span className="text-xs text-text-muted">Chi phí ước tính:</span>
          <div className="text-2xl font-black text-primary">{formatVND(total)}</div>
        </div>
        <p className="text-[11px] text-text-muted max-w-xs mt-2 sm:mt-0">
          * Đơn giá có thể thay đổi tùy thuộc vào mức độ bẩn thực tế và yêu cầu tiến độ gấp.
        </p>
      </div>
    </div>
  );
};

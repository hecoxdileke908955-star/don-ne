'use client';

import React, { useEffect, useState } from 'react';
import { formatVND } from '@/lib/pricing-engine';

interface ServiceOption {
  id: string;
  name: string;
  unit: string;
  basePrice: number;
}

export const PricingCalculator: React.FC = () => {
  const [options, setOptions] = useState<ServiceOption[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(75);

  useEffect(() => {
    fetch('/api/pricing')
      .then(async (response) => {
        if (!response.ok) throw new Error('Pricing unavailable');
        return response.json();
      })
      .then((data) => {
        const items = data.items.map((item: { id: string; itemName: string; unit: string; minPrice: string | number }) => ({ id: item.id, name: item.itemName, unit: item.unit, basePrice: Number(item.minPrice) }));
        setOptions(items);
        setSelectedServiceId(items[0]?.id ?? '');
      })
      .catch(() => setOptions([]));
  }, []);
  const selected = options.find((s) => s.id === selectedServiceId) || options[0];
  if (!selected) return <div className="rounded-card bg-white p-6 shadow-sm border border-gray-200 text-sm text-text-muted">Bảng giá tạm thời chưa khả dụng.</div>;
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
              const next = options.find((option) => option.id === e.target.value);
              setSelectedServiceId(e.target.value);
              setQuantity(next?.unit === 'm²' ? 75 : 1);
            }}
            className="w-full rounded-ctrl border border-gray-300 px-3 py-2 text-xs focus:border-primary focus:outline-none"
          >
            {options.map((opt) => (
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

export interface PriceItemView {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  categoryName: string;
  itemName: string;
  unit: string;
  minPrice: number;
  maxPrice: number | null;
  conditionText?: string | null;
  note?: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sortOrder: number;
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  })
    .format(amount)
    .replace('₫', 'đ');
}

export function formatPriceRange(minPrice: number, maxPrice: number | null, unit: string): string {
  if (!maxPrice || maxPrice === minPrice) {
    return `${formatVND(minPrice)} / ${unit}`;
  }
  return `${minPrice.toLocaleString('vi-VN')} – ${maxPrice.toLocaleString('vi-VN')}đ / ${unit}`;
}

export function estimateServiceCost(
  unitPrice: number,
  quantity: number,
  discountPercentage: number = 0
): number {
  const subtotal = unitPrice * quantity;
  return Math.round(subtotal * (1 - discountPercentage / 100));
}

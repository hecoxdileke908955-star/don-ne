'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { parseAttributionClient, trackClientEvent } from '@/lib/traffic-tracker';

interface QuoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultServiceSlug?: string;
}

export const QuoteFormModal: React.FC<QuoteFormModalProps> = ({
  isOpen,
  onClose,
  defaultServiceSlug = 've-sinh-nha-cua',
}) => {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceSlug, setServiceSlug] = useState(defaultServiceSlug);
  const [district, setDistrict] = useState('Cầu Giấy');
  const [areaDetail, setAreaDetail] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [note, setNote] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (images.length + files.length > 5) {
      alert('Chỉ được tải lên tối đa 5 ảnh hiện trạng.');
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} vượt quá dung lượng 5MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setImages((prev) => [...prev, loadEvt.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) {
      alert('Vui lòng điền họ tên và số điện thoại.');
      return;
    }

    setIsSubmitting(true);
    const attr = parseAttributionClient();
    const payload = {
      customerName,
      phone,
      serviceSlug,
      district,
      areaDetail,
      scheduledTime,
      images,
      customerNote: note,
      utmSource: attr.utmSource,
      landingPage: attr.landingPage,
      sessionId: attr.sessionId
    };

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Quote request was not persisted');
      }
      
      trackClientEvent('quote_form_submit', {
        service: serviceSlug,
        district
      });

      setIsSubmitting(false);
      onClose();
      router.push('/cam-on');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng liên hệ Hotline 0964.182.330!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-block bg-white p-6 shadow-2xl md:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-text-muted hover:bg-gray-100 hover:text-text-main"
          aria-label="Đóng"
        >
          ✕
        </button>

        <div className="mb-5">
          <span className="inline-block rounded-md bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            BÁO GIÁ NHANH TRONG 5 PHÚT
          </span>
          <h3 className="mt-2 text-2xl font-bold text-text-main">
            Nhận Báo Giá Dọn Nè Trọn Gói
          </h3>
          <p className="mt-1 text-xs text-text-muted">
            Khảo sát & tư vấn miễn phí tại Hà Nội. Nghiệm thu hài lòng mới thanh toán.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                required
                placeholder="Anh / Chị..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-ctrl border border-gray-300 px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                Số điện thoại / Zalo *
              </label>
              <input
                type="tel"
                required
                placeholder="09xx xxx xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-ctrl border border-gray-300 px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                Diện tích / chi tiết khu vực
              </label>
              <input
                type="text"
                value={areaDetail}
                onChange={(e) => setAreaDetail(e.target.value)}
                className="w-full rounded-ctrl border border-gray-300 px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                Thời gian mong muốn
              </label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full rounded-ctrl border border-gray-300 px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                Dịch vụ cần làm
              </label>
              <select
                value={serviceSlug}
                onChange={(e) => setServiceSlug(e.target.value)}
                className="w-full rounded-ctrl border border-gray-300 px-3 py-2 text-xs focus:border-primary focus:outline-none"
              >
                <option value="ve-sinh-nha-cua">Tổng vệ sinh nhà cửa</option>
                <option value="ve-sinh-can-ho-chung-cu">Vệ sinh căn hộ chung cư</option>
                <option value="ve-sinh-sau-xay-dung">Vệ sinh sau xây dựng</option>
                <option value="ve-sinh-van-phong">Vệ sinh văn phòng</option>
                <option value="giat-ghe-sofa">Giặt sofa / Nệm / Thảm</option>
                <option value="dich-vu-lau-kinh">Lau kính tòa nhà / Showroom</option>
                <option value="ve-sinh-san-pickleball">Vệ sinh sân Pickleball / Sân sàn</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-main mb-1">
                Khu vực tại Hà Nội
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-ctrl border border-gray-300 px-3 py-2 text-xs focus:border-primary focus:outline-none"
              >
                <option value="Cầu Giấy">Cầu Giấy</option>
                <option value="Đống Đa">Đống Đa</option>
                <option value="Long Biên">Long Biên</option>
                <option value="Hà Đông">Hà Đông</option>
                <option value="Nam Từ Liêm">Nam Từ Liêm</option>
                <option value="Bắc Từ Liêm">Bắc Từ Liêm</option>
                <option value="Thanh Xuân">Thanh Xuân</option>
                <option value="Ba Đình">Ba Đình</option>
                <option value="Tây Hồ">Tây Hồ</option>
                <option value="Hoàng Mai">Hoàng Mai</option>
                <option value="Hai Bà Trưng">Hai Bà Trưng</option>
                <option value="Gia Lâm">Gia Lâm</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-main mb-1">
              Đính kèm ảnh hiện trạng (Tối đa 5 ảnh)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-xs text-text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-ctrl file:border-0 file:text-xs file:font-semibold file:bg-primary-soft file:text-primary hover:file:bg-primary/20"
            />
            {images.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {images.map((src, idx) => (
                  <div key={idx} className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-200">
                    <Image src={src} alt="upload" fill unoptimized className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-main mb-1">
              Ghi chú thêm về yêu cầu hoặc thời gian
            </label>
            <textarea
              rows={2}
              placeholder="VD: Căn hộ 80m2, cần làm sáng Thứ 7 này..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-ctrl border border-gray-300 px-3 py-2 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-ctrl bg-primary py-3 text-xs font-bold text-white shadow hover:bg-primary-hover transition disabled:opacity-50"
          >
            {isSubmitting ? 'ĐANG GỬI YÊU CẦU...' : 'GỬI YÊU CẦU BÁO GIÁ NGAY'}
          </button>
        </form>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { QuoteFormModal } from '@/components/QuoteFormModal';
import { DynamicSectionRenderer } from '@/components/sections/DynamicSectionRenderer';
import { SectionData } from '@/lib/section-schema';

const DEFAULT_SECTIONS: SectionData[] = [
  {
    type: 'Hero',
    variant: 'default',
    order: 1,
    visible: true,
    props: {
      badgeText: 'DỊCH VỤ VỆ SINH CHUYÊN NGHIỆP HÀ NỘI',
      heading: 'Không Gian Sống & Làm Việc',
      highlightWord: 'Sạch Tinh Tươm',
      subheading: 'Dọn Nè mang đến giải pháp tổng vệ sinh nhà cửa, căn hộ chung cư, văn phòng và giặt đệm sofa bằng máy móc hiện đại. Nghiệm thu hài lòng 100% mới thanh toán.',
      primaryCtaText: 'Nhận Báo Giá 5 Phút',
      secondaryCtaText: 'Xem Bảng Giá 2026'
    }
  },
  {
    type: 'ServiceGrid',
    variant: 'default',
    order: 2,
    visible: true,
    props: {
      heading: 'Dịch Vụ Vệ Sinh Trọng Tâm',
      subheading: 'Giải pháp làm sạch toàn diện cho gia đình và doanh nghiệp tại Hà Nội'
    }
  },
  {
    type: 'PricingPreview',
    variant: 'default',
    order: 3,
    visible: true,
    props: {
      heading: 'Bảng Giá Minh Bạch — Không Phát Sinh',
      subheading: 'Giá niêm yết rõ ràng theo diện tích thực tế và khối lượng công việc'
    }
  },
  {
    type: 'BeforeAfter',
    variant: 'default',
    order: 4,
    visible: true,
    props: {
      heading: 'Hình Ảnh Thực Tế Thi Công',
      subheading: 'Kết quả làm sạch rõ rệt trước và sau khi đội ngũ Dọn Nè xử lý'
    }
  },
  {
    type: 'Trust',
    variant: 'default',
    order: 5,
    visible: true,
    props: {
      heading: '3 Lý Do Khách Hàng Chọn Dọn Nè',
      subheading: 'Sự tin cậy và minh bạch là tiêu chuẩn số 1 trong mọi ca làm việc'
    }
  },
  {
    type: 'Process',
    variant: 'default',
    order: 6,
    visible: true,
    props: {
      heading: 'Quy Trình Làm Việc 4 Bước Chuẩn Mực',
      subheading: 'Nhanh chóng, rõ ràng và đảm bảo quyền lợi tối đa của khách hàng'
    }
  },
  {
    type: 'ServiceAreas',
    variant: 'default',
    order: 7,
    visible: true,
    props: {
      heading: 'Phủ Sóng 12 Quận Huyện Hà Nội',
      subheading: 'Đội ngũ túc trực tại các trạm cơ sở, có mặt sau 15-30 phút khi có lịch hẹn'
    }
  },
  {
    type: 'FAQ',
    variant: 'default',
    order: 8,
    visible: true,
    props: {
      heading: 'Câu Hỏi Thường Gặp'
    }
  },
  {
    type: 'CTA',
    variant: 'highlight',
    order: 9,
    visible: true,
    props: {
      heading: 'Đặt Lịch Dọn Dẹp Hôm Nay — Nhận Ưu Đãi Đầu Tuần',
      subheading: 'Liên hệ qua Hotline hoặc Zalo để nhân viên tư vấn gửi phương án tối ưu trong 5 phút.'
    }
  }
];

export default function HomePage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header onOpenQuote={() => setIsQuoteOpen(true)} />
      <main className="flex-1">
        <DynamicSectionRenderer sections={DEFAULT_SECTIONS} onOpenQuote={() => setIsQuoteOpen(true)} />
      </main>
      <Footer />
      <MobileStickyBar onOpenQuote={() => setIsQuoteOpen(true)} />
      <QuoteFormModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}

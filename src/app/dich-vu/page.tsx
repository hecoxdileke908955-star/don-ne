import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const CATEGORIES = [
  {
    name: 'Nhà Ở & Căn Hộ',
    desc: 'Giải pháp vệ sinh định kỳ và tổng vệ sinh gia đình tại Hà Nội',
    items: [
      { slug: 've-sinh-nha-cua', title: 'Tổng Vệ Sinh Nhà Cửa Trọn Gói', desc: 'Dọn sạch từ trần đến sàn, bếp, toilet và kính nội thất.' },
      { slug: 've-sinh-can-ho-chung-cu', title: 'Vệ Sinh Căn Hộ Chung Cư', desc: 'Quy trình dọn sạch nhanh gọn cho căn 1-3 phòng ngủ.' },
    ]
  },
  {
    name: 'Doanh Nghiệp & Xây Dựng',
    desc: 'Vệ sinh công nghiệp cho cơ quan, văn phòng và công trình mới',
    items: [
      { slug: 've-sinh-sau-xay-dung', title: 'Vệ Sinh Công Trình Sau Xây Dựng', desc: 'Sủi sơn, tẩy xi măng, hút bụi mịn công nghiệp 3 mô-tơ.' },
      { slug: 've-sinh-van-phong', title: 'Vệ Sinh Văn Phòng Làm Việc', desc: 'Dọn dẹp định kỳ cuối tuần, không làm gián đoạn công việc.' },
    ]
  },
  {
    name: 'Giặt & Nội Thất',
    desc: 'Khử khuẩn và giặt sâu đệm, sofa, rèm thảm tại nhà',
    items: [
      { slug: 'giat-ghe-sofa', title: 'Giặt Sofa & Đệm Cao Su', desc: 'Phun hút hơi nước nóng 140°C, diệt khuẩn 99.9%.' },
      { slug: 'giat-tham-van-phong', title: 'Giặt Thảm Trải Sàn Văn Phòng', desc: 'Máy chà mâm xoay công nghiệp diện tích lớn.' },
    ]
  },
  {
    name: 'Sàn & Lau Kính',
    desc: 'Bảo dưỡng và phục hồi độ sáng bóng cho mặt kính và sàn đá',
    items: [
      { slug: 'dich-vu-lau-kinh', title: 'Lau Kính Tòa Nhà & Mặt Dựng', desc: 'Thợ đu dây chuyên nghiệp, tẩy ố mốc vảy cá trên kính.' },
      { slug: 've-sinh-san-pickleball', title: 'Vệ Sinh Sân Pickleball / Thể Thao', desc: 'Rửa áp lực cao chống rêu mốc bảo vệ lớp sơn Acrylic.' }
    ]
  }
];

export default function ServicesIndexPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-12 bg-surface-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="rounded bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
              DANH MỤC DỊCH VỤ DỌN NÈ
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main mt-3">
              Dịch Vụ Vệ Sinh Chuyên Nghiệp Tại Hà Nội
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed">
              Phân nhóm khoa học theo từng nhu cầu cụ thể của hộ gia đình và doanh nghiệp. Cam kết nghiệm thu đạt chuẩn mới nhận thanh toán.
            </p>
          </div>

          <div className="space-y-10">
            {CATEGORIES.map((cat, idx) => (
              <div key={idx} className="rounded-card bg-white p-6 sm:p-8 border border-gray-200 shadow-sm">
                <div className="border-b border-gray-100 pb-3 mb-6">
                  <h2 className="text-lg font-bold text-text-main">{cat.name}</h2>
                  <p className="text-xs text-text-muted mt-0.5">{cat.desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="rounded-ctrl border border-gray-100 bg-surface-secondary p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-text-main mb-1">
                          <Link href={`/${item.slug}`} className="hover:text-primary transition">
                            {item.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-gray-200">
                        <Link href={`/${item.slug}`} className="text-xs font-bold text-primary hover:underline">
                          Xem chi tiết & bảng giá →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

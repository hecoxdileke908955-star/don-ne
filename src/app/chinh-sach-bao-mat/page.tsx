'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSiteConfig } from '@/components/SiteConfigProvider';

export default function PrivacyPolicyPage() {
  const config = useSiteConfig();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-12 bg-surface-secondary">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold text-text-main sm:text-4xl">Chính Sách Bảo Mật</h1>

          <div className="mt-8 space-y-6 rounded-[22px] border border-gray-200 bg-white p-7 text-sm leading-relaxed text-text-muted shadow-sm">
            <section>
              <h2 className="mb-2 text-base font-bold text-text-main">1. Thông Tin Thu Thập</h2>
              <p>Khi quý khách gửi yêu cầu báo giá hoặc liên hệ, {config?.brandName ?? 'Dọn Nè'} thu thập họ tên, số điện thoại, địa chỉ và mô tả yêu cầu dịch vụ để phục vụ việc tư vấn, khảo sát và báo giá.</p>
            </section>
            <section>
              <h2 className="mb-2 text-base font-bold text-text-main">2. Mục Đích Sử Dụng</h2>
              <p>Thông tin chỉ được dùng để liên hệ tư vấn, lên lịch khảo sát/thi công và chăm sóc khách hàng sau dịch vụ. {config?.brandName ?? 'Dọn Nè'} không bán hoặc chia sẻ thông tin khách hàng cho bên thứ ba ngoài mục đích vận hành dịch vụ.</p>
            </section>
            <section>
              <h2 className="mb-2 text-base font-bold text-text-main">3. Bảo Mật Dữ Liệu</h2>
              <p>Dữ liệu khách hàng được lưu trữ trên hệ thống có kiểm soát truy cập, chỉ nhân sự được phân quyền mới có thể xem và xử lý.</p>
            </section>
            <section>
              <h2 className="mb-2 text-base font-bold text-text-main">4. Quyền Của Khách Hàng</h2>
              <p>Quý khách có quyền yêu cầu chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp bằng cách liên hệ trực tiếp qua hotline hoặc email {config?.emails[0] ?? 'của chúng tôi'}.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Trung Tâm Vận Hành & Attribution</h1>
          <p className="text-xs text-text-muted">Nguồn Traffic → Landing Page → Lead Tiếp Nhận → Doanh Thu Đơn Hàng</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/leads"
            className="rounded-ctrl bg-primary px-4 py-2 text-xs font-bold text-white shadow hover:bg-primary-hover"
          >
            Xem Danh Sách Lead
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-card bg-white p-5 border border-gray-200 shadow-sm">
          <span className="text-xs text-text-muted">Lead Hôm Nay</span>
          <div className="text-3xl font-black text-text-main mt-1">12</div>
          <span className="text-[11px] text-green-700 font-semibold">+20% so với hôm qua</span>
        </div>
        <div className="rounded-card bg-white p-5 border border-gray-200 shadow-sm">
          <span className="text-xs text-text-muted">Click Gọi Hotline</span>
          <div className="text-3xl font-black text-primary mt-1">48</div>
          <span className="text-[11px] text-text-muted">Tỷ lệ chuyển đổi: 8.4%</span>
        </div>
        <div className="rounded-card bg-white p-5 border border-gray-200 shadow-sm">
          <span className="text-xs text-text-muted">Click Zalo Gửi Ảnh</span>
          <div className="text-3xl font-black text-[#0068FF] mt-1">31</div>
          <span className="text-[11px] text-text-muted">Ưu tiên báo giá nhanh</span>
        </div>
        <div className="rounded-card bg-white p-5 border border-gray-200 shadow-sm">
          <span className="text-xs text-text-muted">Doanh Số Đã Chốt Tuần Này</span>
          <div className="text-2xl font-black text-text-main mt-1">42.500.000đ</div>
          <span className="text-[11px] text-green-700 font-semibold">Tỷ lệ chốt: 64%</span>
        </div>
      </div>

      {/* Attribution Traffic Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-card bg-white p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-text-main mb-4">Hiệu Quả Kênh Traffic (Attribution Source)</h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-text-main mb-1">
                <span>Google Search (SEO Organic)</span>
                <span>48 Leads (62%)</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '62%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-semibold text-text-main mb-1">
                <span>Zalo Share & Khách Giới Thiệu</span>
                <span>18 Leads (23%)</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-[#0068FF] rounded-full" style={{ width: '23%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-semibold text-text-main mb-1">
                <span>Facebook / Tiktok Viral</span>
                <span>11 Leads (15%)</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-card bg-white p-6 border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-text-main mb-4">Top Landing Page Chuyển Đổi Cao Nhất</h3>
          <ul className="space-y-3 text-xs divide-y divide-gray-100">
            <li className="pt-2 flex items-center justify-between">
              <span className="font-semibold text-text-main">/ve-sinh-nha-cua</span>
              <span className="text-primary font-bold">24 leads (14.2%)</span>
            </li>
            <li className="pt-2 flex items-center justify-between">
              <span className="font-semibold text-text-main">/ve-sinh-sau-xay-dung</span>
              <span className="text-primary font-bold">18 leads (11.8%)</span>
            </li>
            <li className="pt-2 flex items-center justify-between">
              <span className="font-semibold text-text-main">/giat-ghe-sofa</span>
              <span className="text-primary font-bold">15 leads (9.5%)</span>
            </li>
            <li className="pt-2 flex items-center justify-between">
              <span className="font-semibold text-text-main">/bang-gia</span>
              <span className="text-primary font-bold">12 leads (8.1%)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

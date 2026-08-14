import React from 'react';
import Link from 'next/link';
import { AdminLogoutButton } from '@/components/AdminLogoutButton';

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="flex min-h-screen w-64 flex-col justify-between border-r border-gray-200 bg-white p-4">
      <div className="space-y-6">
        <div className="px-2">
          <span className="text-lg font-black text-primary">
            DỌN NÈ CMS
          </span>
        </div>

        <nav className="space-y-1 text-xs">
          <Link
            href="/admin"
            className="block rounded-ctrl px-3 py-2 font-semibold hover:bg-surface-secondary"
          >
            Tổng quan Dashboard
          </Link>

          <Link
            href="/admin/leads"
            className="block rounded-ctrl px-3 py-2 font-semibold hover:bg-surface-secondary"
          >
            Quản lý Lead CRM
          </Link>

          <Link
            href="/admin/pricing"
            className="block rounded-ctrl px-3 py-2 font-semibold hover:bg-surface-secondary"
          >
            Bảng giá
          </Link>

          <Link
            href="/admin/services"
            className="block rounded-ctrl px-3 py-2 font-semibold hover:bg-surface-secondary"
          >
            Dịch vụ & Danh mục
          </Link>

          <Link
            href="/admin/settings"
            className="block rounded-ctrl px-3 py-2 font-semibold hover:bg-surface-secondary"
          >
            Cấu hình toàn cục
          </Link>
        </nav>
      </div>

      <div className="border-t border-gray-100 pt-3 text-[11px] text-text-muted">
        <p>Phiên quản trị đã xác thực</p>

        <Link
          href="/"
          className="mt-1 block font-semibold text-primary hover:underline"
        >
          ← Ra website công khai
        </Link>

        <AdminLogoutButton />
      </div>
    </aside>
  );
};

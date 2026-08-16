'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { verifyPermission } from '@/lib/auth';
import { AdminLogoutButton } from '@/components/AdminLogoutButton';

interface NavItem {
  href: string;
  label: string;
  minRole: UserRole;
}

// Single source of truth for the menu — role visibility is filtered from
// minRole via the existing verifyPermission() hierarchy (same function the
// server-side layout.tsx route gates already use), so this list can never
// drift from what those gates actually enforce.
const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Tổng quan Dashboard', minRole: 'EDITOR' },
  { href: '/admin/website', label: 'Chỉnh sửa website', minRole: 'EDITOR' },
  { href: '/admin/pages', label: 'Trang nội dung', minRole: 'EDITOR' },
  { href: '/admin/leads', label: 'Quản lý Lead CRM', minRole: 'ADMIN' },
  { href: '/admin/pricing', label: 'Bảng giá', minRole: 'ADMIN' },
  { href: '/admin/services', label: 'Dịch vụ & Danh mục', minRole: 'EDITOR' },
  { href: '/admin/faqs', label: 'Câu hỏi thường gặp', minRole: 'EDITOR' },
  { href: '/admin/settings', label: 'Cấu hình toàn cục', minRole: 'ADMIN' },
  { href: '/admin/users', label: 'Quản trị viên', minRole: 'SUPER_ADMIN' },
];

export const AdminSidebar: React.FC<{ role: UserRole }> = ({ role }) => {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => verifyPermission(role, item.minRole));
  // Mobile-only drawer state. Below `md` the sidebar is `fixed` (out of the
  // parent flex row entirely — layout.tsx never reserves 256px of content
  // width for it), sliding in/out via translate-x; at `md` and up it drops
  // the fixed/transform treatment and goes back to sitting in-flow at its
  // original static width, unchanged from before this fix.
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Mở menu quản trị"
          className="fixed left-3 top-3 z-40 flex h-9 w-9 items-center justify-center rounded-ctrl border border-gray-200 bg-white/95 text-base shadow-sm md:hidden"
        >
          ☰
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col justify-between border-r border-gray-200 bg-white p-4 transition-transform duration-200 ease-in-out md:static md:z-auto md:h-auto md:min-h-screen md:translate-x-0 md:transition-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <span className="text-lg font-black text-primary">Dọn Nè CMS</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng menu quản trị"
              className="rounded-ctrl p-1 text-text-muted hover:bg-surface-secondary md:hidden"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-1 text-xs">
            {items.map((item) => {
              // '/admin' is the parent segment of every other admin route, so
              // it must only match exactly — otherwise Dashboard would stay
              // active on every other admin page too.
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-ctrl px-3 py-2 font-semibold ${
                    isActive ? 'bg-primary-soft text-primary font-bold' : 'hover:bg-surface-secondary'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-100 pt-3 text-[11px] text-text-muted">
          <p>Phiên quản trị đã xác thực</p>
          <Link href="/" className="mt-1 block font-semibold text-primary hover:underline">← Ra website công khai</Link>
          <AdminLogoutButton />
        </div>
      </aside>
    </>
  );
};

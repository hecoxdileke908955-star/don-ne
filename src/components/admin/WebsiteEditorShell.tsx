'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { verifyPermission } from '@/lib/auth';
import { WEBSITE_MODULES } from '@/components/admin/website-modules';

// Shell holds no website data — only navigation + permission-aware UX, per
// Checkpoint 6 §6/§20. Each module route fetches/saves its own data.
export function WebsiteEditorShell({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const activeHref = WEBSITE_MODULES.find((m) => isActive(m.href))?.href ?? '';

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-text-main">Chỉnh sửa website</h1>
        <p className="text-sm text-text-muted">Quản lý nội dung đang hiển thị trên website Dọn Nè.</p>
      </div>

      {/* Mobile: compact module selector, no second fixed sidebar */}
      <div className="mb-4 md:hidden">
        <select
          className="w-full rounded-ctrl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-text-main"
          value={activeHref}
          onChange={(e) => { if (e.target.value) router.push(e.target.value); }}
        >
          <option value="" disabled>Chọn mục cần chỉnh sửa…</option>
          {WEBSITE_MODULES.map((moduleItem) => {
            const allowed = verifyPermission(role, moduleItem.minRole);
            return (
              <option key={moduleItem.key} value={moduleItem.href} disabled={!allowed}>
                {moduleItem.label}{!allowed ? ' (cần quyền cao hơn)' : ''}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        {/* Desktop: internal nav, not a second app-wide sidebar */}
        <nav className="hidden w-56 shrink-0 space-y-1 rounded-card border border-gray-200 bg-white p-3 text-sm md:block">
          {WEBSITE_MODULES.map((moduleItem) => {
            const allowed = verifyPermission(role, moduleItem.minRole);
            const active = isActive(moduleItem.href);
            if (!allowed) {
              return (
                <span
                  key={moduleItem.key}
                  title="Cần quyền Quản trị viên"
                  aria-disabled="true"
                  className="block cursor-not-allowed rounded-ctrl px-3 py-2 font-semibold text-gray-300"
                >
                  {moduleItem.label}
                  <span className="mt-0.5 block text-[10px] font-normal text-gray-300">Cần quyền Quản trị viên</span>
                </span>
              );
            }
            return (
              <Link
                key={moduleItem.key}
                href={moduleItem.href}
                className={`block rounded-ctrl px-3 py-2 font-semibold ${active ? 'bg-primary-soft text-primary' : 'text-text-main hover:bg-surface-secondary'}`}
              >
                {moduleItem.label}
              </Link>
            );
          })}
        </nav>

        <div className="min-w-0 flex-1 overflow-hidden rounded-card border border-gray-200 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

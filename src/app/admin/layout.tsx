import React from 'react';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { requireAdminSession } from '@/lib/admin-authorization';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!await requireAdminSession()) redirect('/admin-login');

  return (
    <div className="flex min-h-screen bg-surface-secondary">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}

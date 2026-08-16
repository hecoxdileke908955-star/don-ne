import React from 'react';
import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/admin-authorization';
import { WebsiteEditorShell } from '@/components/admin/WebsiteEditorShell';

// Only requires an authenticated admin session here (any role) — the hub and
// EDITOR-level modules (home/services/faq) must be reachable by EDITOR, while
// ADMIN-only modules (business/pricing) enforce their own gate per-route and
// render a controlled "access denied" state instead of redirecting.
export default async function AdminWebsiteLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();
  if (!session) redirect('/admin-login');

  return <WebsiteEditorShell role={session.role}>{children}</WebsiteEditorShell>;
}

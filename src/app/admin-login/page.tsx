'use client';

import { AdminLoginForm } from '@/components/AdminLoginForm';

export default function AdminLoginPage() {
  function handleSuccess() {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');

    window.location.href = next?.startsWith('/admin') ? next : '/admin';
  }

  return (
    <main className="min-h-screen bg-surface-secondary px-4 py-16">
      <div className="mx-auto max-w-md rounded-card border border-gray-200 bg-white p-8">
        <p className="text-sm font-bold text-primary">
          DỌN NÈ CMS
        </p>

        <h1 className="mt-2 text-2xl font-bold text-text-main">
          Đăng nhập quản trị
        </h1>

        <p className="mt-2 text-sm text-text-muted">
          Khu vực quản trị nội bộ của Dọn Nè.
        </p>

        <div className="mt-8">
          <AdminLoginForm onSuccess={handleSuccess} />
        </div>
      </div>
    </main>
  );
}

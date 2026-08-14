'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function logout() {
    setLoading(true);

    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
    } finally {
      router.push('/admin-login');
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={logout}
      className="mt-2 block text-left text-xs font-semibold text-red-700 hover:underline disabled:opacity-60"
    >
      {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
    </button>
  );
}

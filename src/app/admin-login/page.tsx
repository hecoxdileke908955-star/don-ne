'use client';

import { FormEvent, useState } from 'react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || 'Không thể đăng nhập');
        return;
      }

      const params = new URLSearchParams(
        window.location.search
      );

      const next = params.get('next');

      window.location.href =
        next?.startsWith('/admin')
          ? next
          : '/admin';
    } catch {
      setError('Không thể kết nối máy chủ');
    } finally {
      setLoading(false);
    }
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

        <form
          className="mt-8 space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              Mật khẩu quản trị
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={256}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="h-12 w-full rounded-ctrl border border-gray-300 px-3 outline-none focus:border-primary"
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="text-sm font-medium text-red-700"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-ctrl bg-primary px-4 font-semibold text-white disabled:opacity-60"
          >
            {loading
              ? 'Đang kiểm tra...'
              : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </main>
  );
}
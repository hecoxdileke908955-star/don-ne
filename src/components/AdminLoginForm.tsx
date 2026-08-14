'use client';

import { FormEvent, useState } from 'react';

interface AdminLoginFormProps {
  onSuccess: () => void;
  submitLabel?: string;
}

/**
 * Single, shared client for POST /api/admin/auth. Used by both the public
 * /admin-login page and the hidden long-press modal so authentication logic
 * is never duplicated.
 */
export function AdminLoginForm({ onSuccess, submitLabel = 'Đăng nhập' }: AdminLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || 'Không thể đăng nhập');
        return;
      }

      onSuccess();
    } catch {
      setError('Không thể kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="admin-login-email" className="mb-2 block text-sm font-semibold">
          Email
        </label>
        <input
          id="admin-login-email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 w-full rounded-ctrl border border-gray-300 px-3 outline-none focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="admin-login-password" className="mb-2 block text-sm font-semibold">
          Mật khẩu quản trị
        </label>
        <input
          id="admin-login-password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={256}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 w-full rounded-ctrl border border-gray-300 px-3 outline-none focus:border-primary"
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-ctrl bg-primary px-4 font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'Đang kiểm tra...' : submitLabel}
      </button>
    </form>
  );
}

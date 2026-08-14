'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLoginForm } from '@/components/AdminLoginForm';

interface AdminLoginModalProps {
  onClose: () => void;
}

export function AdminLoginModal({ onClose }: AdminLoginModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  function handleSuccess() {
    router.push('/admin');
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-modal-title"
      onClick={onClose}
    >
      <div className="mx-auto flex min-h-full max-w-sm items-center justify-center">
        <div
          className="w-full rounded-card border border-gray-200 bg-white p-6"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-primary">DỌN NÈ CMS</p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="rounded-lg p-1 text-text-muted hover:bg-surface-secondary"
            >
              ✕
            </button>
          </div>

          <h2 id="admin-login-modal-title" className="mt-2 text-lg font-bold text-text-main">
            Đăng nhập quản trị
          </h2>

          <div className="mt-6">
            <AdminLoginForm onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}

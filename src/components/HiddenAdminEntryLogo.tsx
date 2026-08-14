'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminLoginModal } from '@/components/AdminLoginModal';

const LONG_PRESS_MS = 2000;

/**
 * The Admin layout/proxy already redirect an unauthenticated request for
 * /admin to /admin-login. Fetching /admin with redirect: 'manual' reuses
 * that existing server-side check to detect an active session — no new
 * endpoint, and nothing about the session is parsed or exposed client-side.
 */
async function hasActiveAdminSession(): Promise<boolean> {
  try {
    const response = await fetch('/admin', {
      method: 'GET',
      redirect: 'manual',
      credentials: 'same-origin',
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

interface HiddenAdminEntryLogoProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Wraps the public logo. A normal click/tap behaves as an ordinary Home
 * link. Pressing and holding for ~2s reveals the Admin login modal — a UX
 * obscurity affordance only; it grants no authorization by itself.
 */
export function HiddenAdminEntryLogo({ className, children }: HiddenAdminEntryLogoProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);

  const clearPressTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startPress = () => {
    longPressTriggeredRef.current = false;
    clearPressTimer();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      longPressTriggeredRef.current = true;

      void (async () => {
        const authenticated = await hasActiveAdminSession();
        if (authenticated) {
          router.push('/admin');
        } else {
          setModalOpen(true);
        }
      })();
    }, LONG_PRESS_MS);
  };

  const cancelPress = () => {
    clearPressTimer();
  };

  const handleClick = (event: React.MouseEvent) => {
    if (longPressTriggeredRef.current) {
      event.preventDefault();
      longPressTriggeredRef.current = false;
    }
  };

  return (
    <>
      <Link
        href="/"
        className={className}
        onPointerDown={startPress}
        onPointerUp={cancelPress}
        onPointerLeave={cancelPress}
        onPointerCancel={cancelPress}
        onContextMenu={(event) => event.preventDefault()}
        onClick={handleClick}
      >
        {children}
      </Link>

      {modalOpen && <AdminLoginModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

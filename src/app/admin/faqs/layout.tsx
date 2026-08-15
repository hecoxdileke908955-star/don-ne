import { redirect } from 'next/navigation';
import { requireAdminRole } from '@/lib/admin-authorization';

export default async function AdminFaqsLayout({ children }: { children: React.ReactNode }) {
  const authorization = await requireAdminRole('EDITOR');

  if (authorization.status === 'unauthenticated') redirect('/admin-login');
  if (authorization.status === 'forbidden') redirect('/admin');

  return children;
}

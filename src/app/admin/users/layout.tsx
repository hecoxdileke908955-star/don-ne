import { redirect } from 'next/navigation';
import { requireAdminRole } from '@/lib/admin-authorization';

export default async function AdminUsersLayout({ children }: { children: React.ReactNode }) {
  const authorization = await requireAdminRole('SUPER_ADMIN');

  if (authorization.status === 'unauthenticated') redirect('/admin-login');
  if (authorization.status === 'forbidden') redirect('/admin');

  return children;
}

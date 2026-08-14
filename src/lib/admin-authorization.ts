import { cookies } from 'next/headers';
import { verifyAdminSessionToken } from '@/lib/admin-session';

export async function requireAdminSession() {
  const token = (await cookies()).get('don_ne_admin_session')?.value;
  return verifyAdminSessionToken(token);
}

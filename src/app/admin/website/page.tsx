import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdminRole } from '@/lib/admin-authorization';
import { verifyPermission } from '@/lib/auth';
import { WEBSITE_MODULES } from '@/components/admin/website-modules';

export default async function AdminWebsiteHubPage() {
  const authorization = await requireAdminRole('EDITOR');
  if (authorization.status === 'unauthenticated') redirect('/admin-login');
  if (authorization.status === 'forbidden') redirect('/admin');

  const role = authorization.user.role;

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {WEBSITE_MODULES.map((moduleItem) => {
          const allowed = verifyPermission(role, moduleItem.minRole);
          if (!allowed) {
            return (
              <div
                key={moduleItem.key}
                aria-disabled="true"
                title="Cần quyền Quản trị viên"
                className="rounded-card border border-dashed border-gray-200 bg-surface-secondary p-4 text-gray-400"
              >
                <p className="font-bold">{moduleItem.label}</p>
                <p className="mt-1 text-xs">{moduleItem.description}</p>
                <p className="mt-2 text-[11px] font-semibold">Cần quyền Quản trị viên</p>
              </div>
            );
          }
          return (
            <Link
              key={moduleItem.key}
              href={moduleItem.href}
              className="rounded-card border border-gray-200 bg-white p-4 shadow-sm transition hover:border-primary hover:shadow"
            >
              <p className="font-bold text-text-main">{moduleItem.label}</p>
              <p className="mt-1 text-xs text-text-muted">{moduleItem.description}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

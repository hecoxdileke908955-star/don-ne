import { redirect } from 'next/navigation';
import { requireAdminRole } from '@/lib/admin-authorization';
import { ServicesEditor } from '@/components/admin/editors/ServicesEditor';
import { AccessDenied } from '@/components/admin/AccessDenied';
import { ModuleSaveNote } from '@/components/admin/ModuleSaveNote';
import { WEBSITE_MODULES } from '@/components/admin/website-modules';

const MODULE = WEBSITE_MODULES.find((m) => m.key === 'services')!;

export default async function WebsiteServicesPage() {
  const authorization = await requireAdminRole(MODULE.minRole);
  if (authorization.status === 'unauthenticated') redirect('/admin-login');
  if (authorization.status === 'forbidden') return <div className="p-6"><AccessDenied /></div>;

  return (
    <div className="p-4 md:p-6">
      <ModuleSaveNote text={MODULE.saveNote} />
      <ServicesEditor />
    </div>
  );
}

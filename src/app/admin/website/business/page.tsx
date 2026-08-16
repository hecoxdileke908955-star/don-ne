import { redirect } from 'next/navigation';
import { requireAdminRole } from '@/lib/admin-authorization';
import { BusinessSettingsEditor } from '@/components/admin/editors/BusinessSettingsEditor';
import { AccessDenied } from '@/components/admin/AccessDenied';
import { ModuleSaveNote } from '@/components/admin/ModuleSaveNote';
import { WEBSITE_MODULES } from '@/components/admin/website-modules';

const MODULE = WEBSITE_MODULES.find((m) => m.key === 'business')!;

export default async function WebsiteBusinessPage() {
  const authorization = await requireAdminRole(MODULE.minRole);
  if (authorization.status === 'unauthenticated') redirect('/admin-login');
  // Controlled access-denied state, not a silent redirect — and the editor
  // (which fetches site_config) is never rendered/reached when forbidden.
  if (authorization.status === 'forbidden') return <div className="p-6"><AccessDenied /></div>;

  return (
    <div className="p-4 md:p-6">
      <ModuleSaveNote text={MODULE.saveNote} />
      <BusinessSettingsEditor />
    </div>
  );
}

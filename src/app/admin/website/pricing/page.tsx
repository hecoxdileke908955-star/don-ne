import { redirect } from 'next/navigation';
import { requireAdminRole } from '@/lib/admin-authorization';
import { PricingEditor } from '@/components/admin/editors/PricingEditor';
import { AccessDenied } from '@/components/admin/AccessDenied';
import { ModuleSaveNote } from '@/components/admin/ModuleSaveNote';
import { WEBSITE_MODULES } from '@/components/admin/website-modules';

const MODULE = WEBSITE_MODULES.find((m) => m.key === 'pricing')!;

export default async function WebsitePricingPage() {
  const authorization = await requireAdminRole(MODULE.minRole);
  if (authorization.status === 'unauthenticated') redirect('/admin-login');
  // Controlled access-denied state, not a silent redirect — and the editor
  // (which fetches pricing data) is never rendered/reached when forbidden.
  if (authorization.status === 'forbidden') return <div className="p-6"><AccessDenied /></div>;

  return (
    <div className="p-4 md:p-6">
      <ModuleSaveNote text={MODULE.saveNote} />
      <PricingEditor />
    </div>
  );
}

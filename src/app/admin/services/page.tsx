'use client';

import { useEffect, useMemo, useState } from 'react';

type Category = { id: string; name: string };
type ServiceStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
type Service = { id: string; categoryId: string; slug: string; title: string; shortDescription: string | null; badge: string | null; status: ServiceStatus; sortOrder: number; seoTitle: string | null; seoDescription: string | null; category: Category; _count: { priceItems: number; leads: number } };
const blank = (categoryId = '') => ({ categoryId, slug: '', title: '', shortDescription: null as string | null, badge: null as string | null, status: 'DRAFT' as const, sortOrder: 0, seoTitle: null as string | null, seoDescription: null as string | null });

const STATUS_LABELS: Record<ServiceStatus, string> = { DRAFT: 'Nháp', PUBLISHED: 'Đã xuất bản', ARCHIVED: 'Lưu trữ' };
const STATUS_STYLES: Record<ServiceStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PUBLISHED: 'bg-primary-soft text-primary',
  ARCHIVED: 'bg-red-50 text-red-700',
};
function StatusBadge({ status }: { status: ServiceStatus }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [draft, setDraft] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | ''>('');

  const load = async () => { try { const response = await fetch('/api/admin/services'); const data = await response.json(); if (!response.ok) throw new Error(); setServices(data.services); setCategories(data.categories); } catch { setMessage('Không thể tải dịch vụ.'); } finally { setLoading(false); } };
  // The initial request synchronizes this client view with the protected server resource.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return services.filter((service) =>
      (!query || service.title.toLowerCase().includes(query)) &&
      (!categoryFilter || service.categoryId === categoryFilter) &&
      (!statusFilter || service.status === statusFilter)
    );
  }, [services, search, categoryFilter, statusFilter]);

  const save = async () => { if (!draft) return; setSaving(true); setMessage(''); const url = creating ? '/api/admin/services' : `/api/admin/services/${draft.id}`; const response = await fetch(url, { method: creating ? 'POST' : 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ categoryId: draft.categoryId, slug: draft.slug, title: draft.title, shortDescription: draft.shortDescription || null, badge: draft.badge || null, status: draft.status, sortOrder: Number(draft.sortOrder), seoTitle: draft.seoTitle || null, seoDescription: draft.seoDescription || null }) }); const data = await response.json(); setSaving(false); if (!response.ok) { setMessage(data.error || 'Không thể lưu dịch vụ.'); return; } setMessage('Đã lưu vào cơ sở dữ liệu.'); setDraft(null); setCreating(false); await load(); };

  if (loading) return <main className="p-6">Đang tải dịch vụ…</main>;

  return (
    <main className="p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Dịch vụ</h1><p className="text-sm text-text-muted">Dịch vụ được lưu trong PostgreSQL.</p></div>
        <button className="rounded-ctrl bg-primary px-4 py-2 text-sm font-bold text-white" onClick={() => { setDraft({ id: '', ...blank(categories[0]?.id), category: categories[0] ?? { id: '', name: '' }, _count: { priceItems: 0, leads: 0 } }); setCreating(true); }}>Tạo dịch vụ</button>
      </div>

      {message && <p role="status" className="text-sm text-primary">{message}</p>}

      {draft && <section className="space-y-3 rounded-card border bg-white p-4"><h2 className="font-bold">{creating ? 'Tạo dịch vụ' : 'Chỉnh sửa dịch vụ'}</h2><input className="w-full rounded border p-2" value={draft.title} placeholder="Tên dịch vụ" onChange={e => setDraft({ ...draft, title: e.target.value })}/><input className="w-full rounded border p-2" value={draft.slug} placeholder="slug-an-toan" onChange={e => setDraft({ ...draft, slug: e.target.value })}/><select className="w-full rounded border p-2" value={draft.categoryId} onChange={e => setDraft({ ...draft, categoryId: e.target.value })}>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select><input className="w-full rounded border p-2" value={draft.badge ?? ''} placeholder="Nhãn" onChange={e => setDraft({ ...draft, badge: e.target.value || null })}/><textarea className="w-full rounded border p-2" value={draft.shortDescription ?? ''} placeholder="Mô tả ngắn" onChange={e => setDraft({ ...draft, shortDescription: e.target.value || null })}/><div className="space-y-2 rounded border border-dashed p-3"><h3 className="text-sm font-bold text-text-muted">SEO</h3><input className="w-full rounded border p-2 text-sm" value={draft.seoTitle ?? ''} placeholder="SEO Title" maxLength={160} onChange={e => setDraft({ ...draft, seoTitle: e.target.value || null })}/><textarea className="w-full rounded border p-2 text-sm" rows={3} value={draft.seoDescription ?? ''} placeholder="SEO Description" maxLength={320} onChange={e => setDraft({ ...draft, seoDescription: e.target.value || null })}/></div><div className="flex gap-3"><select className="rounded border p-2" value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as Service['status'] })}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select><input className="w-24 rounded border p-2" type="number" min="0" value={draft.sortOrder} onChange={e => setDraft({ ...draft, sortOrder: Number(e.target.value) })}/><button disabled={saving} className="rounded-ctrl bg-primary px-4 py-2 text-sm font-bold text-white" onClick={() => void save()}>{saving ? 'Đang lưu…' : 'Lưu'}</button><button className="px-3" onClick={() => { setDraft(null); setCreating(false); }}>Hủy</button></div></section>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm sm:max-w-xs" placeholder="Tìm tên dịch vụ…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ServiceStatus | '')}>
          <option value="">Tất cả trạng thái</option>
          {(Object.keys(STATUS_LABELS) as ServiceStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {filteredServices.length === 0 ? (
        <div className="rounded-card border border-dashed border-gray-200 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-text-main">Không có dịch vụ nào phù hợp</p>
          <p className="mt-1 text-xs text-text-muted">Thử đổi từ khoá tìm kiếm hoặc bộ lọc.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-card border border-gray-200 bg-white shadow-sm md:block">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary text-text-muted">
                <tr><th className="p-3 font-semibold">Tên dịch vụ</th><th className="p-3 font-semibold">Danh mục</th><th className="p-3 font-semibold">Trạng thái</th><th className="p-3 font-semibold">Số hạng mục giá</th><th className="p-3 font-semibold">Số Lead</th><th className="p-3 font-semibold">Hành động</th></tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id} className="border-t border-gray-100">
                    <td className="p-3"><b>{service.title}</b><br /><span className="text-text-muted">/{service.slug}</span></td>
                    <td className="p-3">{service.category.name}</td>
                    <td className="p-3"><StatusBadge status={service.status} /></td>
                    <td className="p-3">{service._count.priceItems}</td>
                    <td className="p-3">{service._count.leads}</td>
                    <td className="p-3"><button className="rounded border px-3 py-1 font-semibold hover:bg-surface-secondary" onClick={() => { setDraft(service); setCreating(false); }}>Sửa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {filteredServices.map((service) => (
              <div key={service.id} className="rounded-card border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-text-main">{service.title}</p>
                    <p className="text-xs text-text-muted">{service.category.name}</p>
                  </div>
                  <StatusBadge status={service.status} />
                </div>
                <p className="mt-2 text-xs text-text-muted">{service._count.priceItems} giá · {service._count.leads} lead</p>
                <button className="mt-3 w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-surface-secondary" onClick={() => { setDraft(service); setCreating(false); }}>Sửa</button>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

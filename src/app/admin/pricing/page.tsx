'use client';

import { useEffect, useMemo, useState } from 'react';

type PriceStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
type PriceItem = {
  id: string;
  serviceId: string;
  itemName: string;
  unit: string;
  minPrice: string;
  maxPrice: string | null;
  conditionText: string | null;
  note: string | null;
  sortOrder: number;
  status: PriceStatus;
  service: { title: string; slug: string };
};
type ServiceOption = { id: string; title: string };

const STATUS_LABELS: Record<PriceStatus, string> = { DRAFT: 'Nháp', PUBLISHED: 'Đã xuất bản', ARCHIVED: 'Lưu trữ' };
const STATUS_STYLES: Record<PriceStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PUBLISHED: 'bg-primary-soft text-primary',
  ARCHIVED: 'bg-red-50 text-red-700',
};
function StatusBadge({ status }: { status: PriceStatus }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}

const formatVnd = (value: string) => `${Number(value).toLocaleString('vi-VN')}đ`;
const formatRange = (item: PriceItem) => item.maxPrice == null ? formatVnd(item.minPrice) : `${formatVnd(item.minPrice)} – ${formatVnd(item.maxPrice)}`;

type DraftForm = {
  serviceId: string;
  itemName: string;
  unit: string;
  minPrice: string;
  maxPrice: string;
  conditionText: string;
  note: string;
  sortOrder: string;
  status: PriceStatus;
};
const blankForm = (serviceId = ''): DraftForm => ({ serviceId, itemName: '', unit: '', minPrice: '', maxPrice: '', conditionText: '', note: '', sortOrder: '0', status: 'DRAFT' });

export default function AdminPricingPage() {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DraftForm>(blankForm());
  const [saving, setSaving] = useState(false);
  const [drawerError, setDrawerError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/pricing');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể tải bảng giá.');
      setItems(data.items ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Không thể tải bảng giá.');
    } finally {
      setLoading(false);
    }
  };
  // Synchronizes this client view with the protected server resource on first mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);

  useEffect(() => {
    fetch('/api/admin/services')
      .then(async (r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => setServices(data.services.map((s: { id: string; title: string }) => ({ id: s.id, title: s.title }))))
      .catch(() => setServices([]));
  }, []);

  const filteredItems = useMemo(
    () => (serviceFilter ? items.filter((item) => item.serviceId === serviceFilter) : items),
    [items, serviceFilter]
  );

  const openCreate = () => {
    setDrawerMode('create');
    setEditingId(null);
    setForm(blankForm(serviceFilter || services[0]?.id || ''));
    setDrawerError('');
  };
  const openEdit = (item: PriceItem) => {
    setDrawerMode('edit');
    setEditingId(item.id);
    setForm({
      serviceId: item.serviceId,
      itemName: item.itemName,
      unit: item.unit,
      minPrice: item.minPrice,
      maxPrice: item.maxPrice ?? '',
      conditionText: item.conditionText ?? '',
      note: item.note ?? '',
      sortOrder: String(item.sortOrder),
      status: item.status,
    });
    setDrawerError('');
  };
  const closeDrawer = () => { setDrawerMode(null); setEditingId(null); };

  const saveDrawer = async () => {
    setSaving(true);
    setDrawerError('');
    const payload = {
      itemName: form.itemName.trim(),
      unit: form.unit.trim(),
      minPrice: form.minPrice.trim() === '' ? NaN : Number(form.minPrice),
      maxPrice: form.maxPrice.trim() === '' ? null : Number(form.maxPrice),
      conditionText: form.conditionText.trim() === '' ? null : form.conditionText.trim(),
      note: form.note.trim() === '' ? null : form.note.trim(),
      sortOrder: Number(form.sortOrder) || 0,
      status: form.status,
      ...(drawerMode === 'create' ? { serviceId: form.serviceId } : {}),
    };
    try {
      const url = drawerMode === 'create' ? '/api/admin/pricing' : `/api/admin/pricing/${editingId}`;
      const response = await fetch(url, {
        method: drawerMode === 'create' ? 'POST' : 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể lưu hạng mục giá.');
      closeDrawer();
      await load();
    } catch (saveError) {
      setDrawerError(saveError instanceof Error ? saveError.message : 'Không thể lưu hạng mục giá.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="p-6">Đang tải bảng giá…</main>;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Bảng Giá Dịch Vụ</h1>
        <p className="text-xs text-text-muted">Hạng mục giá được lưu trong PostgreSQL.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <select className="rounded-ctrl border border-gray-200 px-3 py-2 text-sm sm:max-w-xs" value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
          <option value="">Tất cả dịch vụ</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <button className="rounded-ctrl bg-primary px-4 py-2 text-sm font-bold text-white" onClick={openCreate}>Thêm hạng mục</button>
      </div>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      {filteredItems.length === 0 ? (
        <div className="rounded-card border border-dashed border-gray-200 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-text-main">Chưa có hạng mục giá nào</p>
          <p className="mt-1 text-xs text-text-muted">Bấm &quot;Thêm hạng mục&quot; để tạo hạng mục giá đầu tiên.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-card border border-gray-200 bg-white shadow-sm md:block">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary text-text-muted">
                <tr><th className="p-3 font-semibold">Dịch vụ</th><th className="p-3 font-semibold">Hạng mục</th><th className="p-3 font-semibold">Đơn vị</th><th className="p-3 font-semibold">Giá</th><th className="p-3 font-semibold">Trạng thái</th><th className="p-3 font-semibold">Hành động</th></tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="p-3 font-semibold">{item.service.title}</td>
                    <td className="p-3">{item.itemName}</td>
                    <td className="p-3">{item.unit}</td>
                    <td className="p-3">{formatRange(item)}</td>
                    <td className="p-3"><StatusBadge status={item.status} /></td>
                    <td className="p-3"><button className="rounded border px-3 py-1 font-semibold hover:bg-surface-secondary" onClick={() => openEdit(item)}>Sửa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {filteredItems.map((item) => (
              <div key={item.id} className="rounded-card border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-text-muted">{item.service.title}</p>
                    <p className="text-sm font-bold text-text-main">{item.itemName}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-2 text-sm font-semibold text-primary">{formatRange(item)}</p>
                <button className="mt-3 w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-surface-secondary" onClick={() => openEdit(item)}>Sửa</button>
              </div>
            ))}
          </div>
        </>
      )}

      {drawerMode && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={closeDrawer} aria-hidden="true" />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-y-auto border-l border-gray-200 bg-white p-5 shadow-xl md:w-[480px]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-main">{drawerMode === 'create' ? 'Thêm hạng mục giá' : 'Sửa hạng mục giá'}</h2>
              <button onClick={closeDrawer} aria-label="Đóng" className="rounded-ctrl p-1 text-text-muted hover:bg-surface-secondary">✕</button>
            </div>

            <div className="space-y-3 text-sm">
              {drawerMode === 'create' && (
                <div>
                  <label className="mb-1 block text-xs font-semibold">Dịch vụ</label>
                  <select className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
                    {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-semibold">Hạng mục</label>
                <input className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Đơn vị</label>
                <input className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold">Giá từ (đ)</label>
                  <input type="number" min={0} className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={form.minPrice} onChange={(e) => setForm({ ...form, minPrice: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Giá đến (đ)</label>
                  <input type="number" min={0} className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={form.maxPrice} onChange={(e) => setForm({ ...form, maxPrice: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Điều kiện</label>
                <input className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={form.conditionText} onChange={(e) => setForm({ ...form, conditionText: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Ghi chú</label>
                <textarea className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold">Thứ tự</label>
                  <input type="number" min={0} className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Trạng thái</label>
                  <select className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PriceStatus })}>
                    {(Object.keys(STATUS_LABELS) as PriceStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>
              <p className="text-xs text-text-muted">Không còn dùng hạng mục này? Đổi trạng thái sang &quot;Lưu trữ&quot; thay vì xoá — dữ liệu vẫn được giữ lại.</p>

              {drawerError && <p role="alert" className="text-sm text-red-700">{drawerError}</p>}

              <button disabled={saving} onClick={() => void saveDrawer()} className="w-full rounded-ctrl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                {saving ? 'Đang lưu…' : 'Lưu'}
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';

type Status = 'NEW' | 'CONTACTED' | 'QUOTED' | 'WON' | 'LOST';

type Lead = {
  id: string;
  leadCode: string;
  customerName: string;
  phone: string;
  serviceId: string | null;
  service: { title: string } | null;
  serviceName: string | null;
  district: string | null;
  addressDetail: string | null;
  estimatedArea: string | null;
  scheduledTime: string | null;
  imageUrls: string[] | null;
  customerNote: string | null;
  internalNote: string | null;
  status: Status;
  quotedPrice: string | null;
  finalOrderValue: string | null;
  utmSource: string | null;
  landingPage: string | null;
  createdAt: string;
  updatedAt: string;
};

type ServiceOption = { id: string; title: string };

const STATUSES: Status[] = ['NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST'];
const STATUS_LABELS: Record<Status, string> = {
  NEW: 'Mới', CONTACTED: 'Đã liên hệ', QUOTED: 'Đã báo giá', WON: 'Đã chốt', LOST: 'Đã mất',
};
const STATUS_STYLES: Record<Status, string> = {
  NEW: 'bg-gray-100 text-gray-700',
  CONTACTED: 'bg-blue-50 text-blue-700',
  QUOTED: 'bg-accent-soft text-accent',
  WON: 'bg-primary-soft text-primary',
  LOST: 'bg-red-50 text-red-700',
};
const PAGE_SIZE = 20;

const formatVnd = (value: string | null) => value == null ? '—' : `${Number(value).toLocaleString('vi-VN')}đ`;
const formatDate = (value: string) => new Date(value).toLocaleString('vi-VN');

function StatusBadge({ status }: { status: Status }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [services, setServices] = useState<ServiceOption[]>([]);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [draftStatus, setDraftStatus] = useState<Status>('NEW');
  const [draftNote, setDraftNote] = useState('');
  const [draftQuoted, setDraftQuoted] = useState('');
  const [draftFinal, setDraftFinal] = useState('');
  const [savingDrawer, setSavingDrawer] = useState(false);
  const [drawerError, setDrawerError] = useState('');

  // Debounce search input so filtering doesn't fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Any filter change invalidates the current page — jump back to page 1.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPage(1); }, [search, statusFilter, serviceFilter]);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (serviceFilter) params.set('serviceId', serviceFilter);
      const response = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể tải dữ liệu Lead.');
      setLeads(data.leads);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Không thể tải dữ liệu Lead.');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, serviceFilter]);

  // Synchronizes this client view with the protected server resource whenever
  // pagination/filters change.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void loadLeads(); }, [loadLeads]);

  useEffect(() => {
    fetch('/api/admin/services')
      .then(async (r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => setServices(data.services.map((s: { id: string; title: string }) => ({ id: s.id, title: s.title }))))
      .catch(() => setServices([]));
  }, []);

  const openLead = (lead: Lead) => {
    setSelectedLead(lead);
    setDraftStatus(lead.status);
    setDraftNote(lead.internalNote ?? '');
    setDraftQuoted(lead.quotedPrice ?? '');
    setDraftFinal(lead.finalOrderValue ?? '');
    setDrawerError('');
  };
  const closeDrawer = () => setSelectedLead(null);

  const saveDrawer = async () => {
    if (!selectedLead) return;
    setSavingDrawer(true);
    setDrawerError('');
    const payload = {
      status: draftStatus,
      internalNote: draftNote.trim() === '' ? null : draftNote.trim(),
      quotedPrice: draftQuoted.trim() === '' ? null : Number(draftQuoted),
      finalOrderValue: draftFinal.trim() === '' ? null : Number(draftFinal),
    };
    try {
      const response = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể lưu thay đổi.');
      const updated = data.lead as Lead;
      setSelectedLead(updated);
      setLeads((current) => current.map((lead) => (lead.id === updated.id ? { ...lead, ...updated } : lead)));
    } catch (saveError) {
      setDrawerError(saveError instanceof Error ? saveError.message : 'Không thể lưu thay đổi.');
    } finally {
      setSavingDrawer(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Quản Lý Lead & Đơn Hàng CRM</h1>
        <p className="text-xs text-text-muted">Dữ liệu Lead được đọc trực tiếp từ cơ sở dữ liệu.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm sm:max-w-xs"
          placeholder="Tìm tên, SĐT, mã Lead…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select className="rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as Status | '')}>
          <option value="">Tất cả trạng thái</option>
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select className="rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
          <option value="">Tất cả dịch vụ</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </div>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-sm text-text-muted">Đang tải…</p>
      ) : leads.length === 0 ? (
        <div className="rounded-card border border-dashed border-gray-200 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-text-main">Không có Lead nào phù hợp</p>
          <p className="mt-1 text-xs text-text-muted">Thử đổi từ khoá tìm kiếm hoặc bộ lọc.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-card border border-gray-200 bg-white shadow-sm md:block">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary text-text-muted">
                <tr><th className="p-3 font-semibold">Mã Lead</th><th className="p-3 font-semibold">Khách hàng</th><th className="p-3 font-semibold">Dịch vụ</th><th className="p-3 font-semibold">Khu vực</th><th className="p-3 font-semibold">Trạng thái</th><th className="p-3 font-semibold">Ngày tạo</th></tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="cursor-pointer border-t border-gray-100 hover:bg-surface-secondary/60" onClick={() => openLead(lead)}>
                    <td className="p-3 font-mono">{lead.leadCode}</td>
                    <td className="p-3"><b>{lead.customerName}</b><br />{lead.phone}</td>
                    <td className="p-3">{lead.service?.title ?? lead.serviceName ?? 'Chưa chọn'}</td>
                    <td className="p-3">{lead.district ?? '—'}</td>
                    <td className="p-3"><StatusBadge status={lead.status} /></td>
                    <td className="p-3">{formatDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {leads.map((lead) => (
              <button key={lead.id} onClick={() => openLead(lead)} className="block w-full rounded-card border border-gray-200 bg-white p-4 text-left shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-text-main">{lead.customerName}</p>
                    <p className="text-xs text-text-muted">{lead.phone}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
                <p className="mt-2 text-xs text-text-muted">{lead.service?.title ?? lead.serviceName ?? 'Chưa chọn dịch vụ'}</p>
                <p className="mt-1 text-[11px] text-text-light">{formatDate(lead.createdAt)}</p>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>{total} Lead · Trang {page}/{totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-ctrl border border-gray-200 px-3 py-1.5 font-semibold disabled:opacity-40">← Trước</button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-ctrl border border-gray-200 px-3 py-1.5 font-semibold disabled:opacity-40">Sau →</button>
            </div>
          </div>
        </>
      )}

      {selectedLead && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={closeDrawer} aria-hidden="true" />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-y-auto border-l border-gray-200 bg-white p-5 shadow-xl md:w-[480px]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-main">Chi tiết Lead {selectedLead.leadCode}</h2>
              <button onClick={closeDrawer} aria-label="Đóng" className="rounded-ctrl p-1 text-text-muted hover:bg-surface-secondary">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <section className="space-y-1">
                <p><span className="font-semibold">Khách hàng:</span> {selectedLead.customerName}</p>
                <p><span className="font-semibold">SĐT:</span> {selectedLead.phone}</p>
                <p><span className="font-semibold">Dịch vụ:</span> {selectedLead.service?.title ?? selectedLead.serviceName ?? 'Chưa chọn'}</p>
                <p><span className="font-semibold">Khu vực:</span> {selectedLead.district ?? '—'}</p>
                <p><span className="font-semibold">Địa chỉ:</span> {selectedLead.addressDetail ?? '—'}</p>
                <p><span className="font-semibold">Diện tích ước tính:</span> {selectedLead.estimatedArea ?? '—'}</p>
                <p><span className="font-semibold">Lịch hẹn:</span> {selectedLead.scheduledTime ?? '—'}</p>
                <p><span className="font-semibold">Ghi chú khách:</span> {selectedLead.customerNote ?? '—'}</p>
                <p><span className="font-semibold">Nguồn (UTM):</span> {selectedLead.utmSource ?? '—'}</p>
                <p><span className="font-semibold">Landing page:</span> {selectedLead.landingPage ?? '—'}</p>
                <p><span className="font-semibold">Tạo lúc:</span> {formatDate(selectedLead.createdAt)}</p>
                <p><span className="font-semibold">Cập nhật lúc:</span> {formatDate(selectedLead.updatedAt)}</p>
              </section>

              {selectedLead.imageUrls && selectedLead.imageUrls.length > 0 && (
                <section>
                  <p className="mb-1.5 font-semibold">Ảnh khách gửi</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedLead.imageUrls.map((url, index) => (
                      // eslint-disable-next-line @next/next/no-img-element -- base64 data URIs from customer uploads, not an optimizable static asset
                      <img key={index} src={url} alt={`Ảnh khách gửi ${index + 1}`} className="aspect-square w-full rounded-ctrl border border-gray-200 object-cover" />
                    ))}
                  </div>
                </section>
              )}

              <section className="space-y-3 border-t border-gray-100 pt-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold">Trạng thái</label>
                  <select className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={draftStatus} onChange={(e) => setDraftStatus(e.target.value as Status)}>
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Ghi chú nội bộ</label>
                  <textarea className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" rows={3} maxLength={2000} value={draftNote} onChange={(e) => setDraftNote(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold">Giá đã báo (đ)</label>
                    <input type="number" min={0} className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={draftQuoted} onChange={(e) => setDraftQuoted(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold">Giá trị chốt (đ)</label>
                    <input type="number" min={0} className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={draftFinal} onChange={(e) => setDraftFinal(e.target.value)} />
                  </div>
                </div>
                <p className="text-xs text-text-muted">Hiện tại — Giá đã báo: {formatVnd(selectedLead.quotedPrice)} · Giá trị chốt: {formatVnd(selectedLead.finalOrderValue)}</p>

                {drawerError && <p role="alert" className="text-sm text-red-700">{drawerError}</p>}

                <button disabled={savingDrawer} onClick={() => void saveDrawer()} className="w-full rounded-ctrl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                  {savingDrawer ? 'Đang lưu…' : 'Lưu thay đổi'}
                </button>
              </section>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';

type Faq = { id: string; question: string; answer: string; sortOrder: number; isActive: boolean };
const blank = () => ({ question: '', answer: '', sortOrder: 0, isActive: true });

type StatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${isActive ? 'bg-primary-soft text-primary' : 'bg-gray-100 text-gray-700'}`}>
      {isActive ? 'Đang hiển thị' : 'Đã ẩn'}
    </span>
  );
}

const truncate = (text: string, max: number) => (text.length > max ? `${text.slice(0, max)}…` : text);

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [draft, setDraft] = useState<Faq | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageIsError, setMessageIsError] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const load = async () => {
    try {
      const response = await fetch('/api/admin/faqs');
      const data = await response.json();
      if (!response.ok) throw new Error();
      setFaqs(data.faqs);
    } catch {
      setMessage('Không thể tải câu hỏi thường gặp.');
      setMessageIsError(true);
    } finally {
      setLoading(false);
    }
  };
  // The initial request synchronizes this client view with the protected server resource.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return faqs.filter((faq) =>
      (!query || faq.question.toLowerCase().includes(query)) &&
      (statusFilter === 'ALL' || (statusFilter === 'ACTIVE') === faq.isActive)
    );
  }, [faqs, search, statusFilter]);

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setMessage('');
    const url = creating ? '/api/admin/faqs' : `/api/admin/faqs/${draft.id}`;
    const response = await fetch(url, {
      method: creating ? 'POST' : 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question: draft.question, answer: draft.answer, sortOrder: Number(draft.sortOrder), isActive: draft.isActive }),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) { setMessage(data.error || 'Không thể lưu câu hỏi.'); setMessageIsError(true); return; }
    setMessage('Đã lưu vào cơ sở dữ liệu.');
    setMessageIsError(false);
    setDraft(null);
    setCreating(false);
    await load();
  };

  const toggleActive = async (faq: Faq) => {
    setMessage('');
    const response = await fetch(`/api/admin/faqs/${faq.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ isActive: !faq.isActive }),
    });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || 'Không thể cập nhật trạng thái.'); setMessageIsError(true); return; }
    await load();
  };

  if (loading) return <main className="p-6"><p className="text-sm text-text-muted">Đang tải câu hỏi thường gặp…</p></main>;

  return (
    <main className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Câu hỏi thường gặp</h1>
          <p className="text-sm text-text-muted">FAQ được lưu trong PostgreSQL và hiển thị trên trang chủ.</p>
        </div>
        <button className="rounded-ctrl bg-primary px-4 py-2 text-sm font-bold text-white" onClick={() => { setDraft({ id: '', ...blank() }); setCreating(true); }}>Tạo câu hỏi</button>
      </div>

      {message && <p role={messageIsError ? 'alert' : 'status'} className={`text-sm ${messageIsError ? 'text-red-600' : 'text-primary'}`}>{message}</p>}

      {draft && (
        <section className="space-y-3 rounded-card border border-gray-200 bg-white p-4">
          <h2 className="font-bold text-text-main">{creating ? 'Tạo câu hỏi' : 'Chỉnh sửa câu hỏi'}</h2>
          <div>
            <label className="mb-1 block text-xs font-semibold text-text-main">Câu hỏi</label>
            <input className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={draft.question} maxLength={300} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-text-main">Câu trả lời</label>
            <textarea className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm" rows={4} value={draft.answer} maxLength={2000} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1.5 text-xs text-text-main">
              Thứ tự
              <input type="number" className="w-20 rounded-ctrl border border-gray-200 px-2 py-1.5" min={0} value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} />
            </label>
            <label className="flex items-center gap-1.5 text-xs text-text-main">
              <input type="checkbox" checked={draft.isActive} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />
              Hiển thị công khai
            </label>
          </div>
          <div className="flex gap-3">
            <button disabled={saving} className="rounded-ctrl bg-primary px-4 py-2 text-xs font-bold text-white disabled:opacity-60" onClick={() => void save()}>{saving ? 'Đang lưu…' : 'Lưu'}</button>
            <button className="px-3 text-xs font-semibold text-text-muted" onClick={() => { setDraft(null); setCreating(false); }}>Hủy</button>
          </div>
        </section>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input className="w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm sm:max-w-xs" placeholder="Tìm câu hỏi…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="rounded-ctrl border border-gray-200 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
          <option value="ALL">Tất cả</option>
          <option value="ACTIVE">Đang hiển thị</option>
          <option value="INACTIVE">Đã ẩn</option>
        </select>
      </div>

      {faqs.length === 0 ? (
        <div className="rounded-card border border-dashed border-gray-200 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-text-main">Chưa có câu hỏi nào</p>
          <p className="mt-1 text-xs text-text-muted">Bấm &quot;Tạo câu hỏi&quot; để thêm câu hỏi đầu tiên.</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="rounded-card border border-dashed border-gray-200 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-text-main">Không có câu hỏi nào phù hợp</p>
          <p className="mt-1 text-xs text-text-muted">Thử đổi từ khoá tìm kiếm hoặc bộ lọc.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-card border border-gray-200 bg-white shadow-sm md:block">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary text-text-muted">
                <tr><th className="p-3 font-semibold">Câu hỏi</th><th className="p-3 font-semibold">Thứ tự</th><th className="p-3 font-semibold">Trạng thái</th><th className="p-3 font-semibold">Hành động</th></tr>
              </thead>
              <tbody>
                {filteredFaqs.map((faq) => (
                  <tr key={faq.id} className="border-t border-gray-100">
                    <td className="p-3">
                      <p className="font-bold text-text-main">{faq.question}</p>
                      <p className="mt-0.5 text-text-muted">{truncate(faq.answer, 100)}</p>
                    </td>
                    <td className="p-3">{faq.sortOrder}</td>
                    <td className="p-3"><StatusBadge isActive={faq.isActive} /></td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button className="rounded border border-gray-200 px-3 py-1 font-semibold hover:bg-surface-secondary" onClick={() => { setDraft(faq); setCreating(false); }}>Sửa</button>
                        <button className="rounded border border-gray-200 px-3 py-1 font-semibold hover:bg-surface-secondary" onClick={() => void toggleActive(faq)}>{faq.isActive ? 'Ẩn' : 'Hiển thị'}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-2 md:hidden">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="rounded-card border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-text-main">{faq.question}</p>
                  <StatusBadge isActive={faq.isActive} />
                </div>
                <p className="mt-1.5 text-xs text-text-muted">{truncate(faq.answer, 80)}</p>
                <p className="mt-1.5 text-[11px] text-text-light">Thứ tự {faq.sortOrder}</p>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-ctrl border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-surface-secondary" onClick={() => { setDraft(faq); setCreating(false); }}>Sửa</button>
                  <button className="flex-1 rounded-ctrl border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-surface-secondary" onClick={() => void toggleActive(faq)}>{faq.isActive ? 'Ẩn' : 'Hiển thị'}</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

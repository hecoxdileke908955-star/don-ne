'use client';

import { useEffect, useState } from 'react';

type Faq = { id: string; question: string; answer: string; sortOrder: number; isActive: boolean };
const blank = () => ({ question: '', answer: '', sortOrder: 0, isActive: true });

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [draft, setDraft] = useState<Faq | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const response = await fetch('/api/admin/faqs');
      const data = await response.json();
      if (!response.ok) throw new Error();
      setFaqs(data.faqs);
    } catch {
      setMessage('Không thể tải câu hỏi thường gặp.');
    } finally {
      setLoading(false);
    }
  };
  // The initial request synchronizes this client view with the protected server resource.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);

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
    if (!response.ok) { setMessage(data.error || 'Không thể lưu câu hỏi.'); return; }
    setMessage('Đã lưu vào cơ sở dữ liệu.');
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
    if (!response.ok) { setMessage(data.error || 'Không thể cập nhật trạng thái.'); return; }
    await load();
  };

  if (loading) return <main className="p-6">Đang tải câu hỏi thường gặp…</main>;

  return (
    <main className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Câu hỏi thường gặp</h1>
          <p className="text-sm text-text-muted">FAQ được lưu trong PostgreSQL và hiển thị trên trang chủ.</p>
        </div>
        <button className="rounded-ctrl bg-primary px-4 py-2 text-sm font-bold text-white" onClick={() => { setDraft({ id: '', ...blank() }); setCreating(true); }}>Tạo câu hỏi</button>
      </div>

      {message && <p role="status" className="text-sm text-primary">{message}</p>}

      {draft && (
        <section className="space-y-3 rounded-card border bg-white p-4">
          <h2 className="font-bold">{creating ? 'Tạo câu hỏi' : 'Chỉnh sửa câu hỏi'}</h2>
          <div>
            <label className="mb-1 block text-xs font-semibold">Câu hỏi</label>
            <input className="w-full rounded border p-2 text-sm" value={draft.question} maxLength={300} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold">Câu trả lời</label>
            <textarea className="w-full rounded border p-2 text-sm" rows={4} value={draft.answer} maxLength={2000} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-xs">
              Thứ tự
              <input type="number" className="w-20 rounded border p-1" min={0} value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} />
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <input type="checkbox" checked={draft.isActive} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />
              Hiển thị công khai
            </label>
            <button disabled={saving} className="rounded-ctrl bg-primary px-4 py-2 text-xs font-bold text-white disabled:opacity-60" onClick={() => void save()}>{saving ? 'Đang lưu…' : 'Lưu'}</button>
            <button className="px-3 text-xs" onClick={() => { setDraft(null); setCreating(false); }}>Hủy</button>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-card border bg-white">
        <div className="divide-y">
          {faqs.map((faq) => (
            <div key={faq.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-bold">{faq.question}</p>
                <p className="text-xs text-text-muted mt-1">Thứ tự {faq.sortOrder} · {faq.isActive ? 'Đang hiển thị' : 'Đã ẩn'}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded border px-3 py-1 text-sm" onClick={() => { setDraft(faq); setCreating(false); }}>Sửa</button>
                <button className="rounded border px-3 py-1 text-sm" onClick={() => void toggleActive(faq)}>{faq.isActive ? 'Ẩn' : 'Hiển thị'}</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

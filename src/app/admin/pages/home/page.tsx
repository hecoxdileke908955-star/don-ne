'use client';

import { useEffect, useState } from 'react';

type SectionType = 'Hero' | 'ServiceGrid' | 'PricingPreview' | 'BeforeAfter' | 'Trust' | 'Process' | 'ServiceAreas' | 'FAQ' | 'CTA';
type SectionProps = Record<string, unknown> & {
  heading?: string;
  subheading?: string;
  badgeText?: string;
  highlightWord?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
};
type Section = { id: string; type: SectionType; variant: string; order: number; visible: boolean; props: SectionProps };
type PageMeta = { id: string; slug: string; title: string; status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; seoTitle: string | null; seoDescription: string | null };

const EDITABLE_FIELDS: Array<{ key: keyof SectionProps; label: string }> = [
  { key: 'badgeText', label: 'Nhãn (badge)' },
  { key: 'heading', label: 'Tiêu đề' },
  { key: 'highlightWord', label: 'Từ nhấn mạnh' },
  { key: 'subheading', label: 'Mô tả phụ' },
  { key: 'primaryCtaText', label: 'Nút chính' },
  { key: 'secondaryCtaText', label: 'Nút phụ' },
];

export default function AdminHomePageEditor() {
  const [page, setPage] = useState<PageMeta | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [savingSectionId, setSavingSectionId] = useState<string | null>(null);
  const [savingMeta, setSavingMeta] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const load = async () => {
    try {
      const response = await fetch('/api/admin/pages/home');
      const data = await response.json();
      if (!response.ok) throw new Error();
      setPage(data.page);
      setSections(data.page.sections);
    } catch {
      setMessage('Không thể tải nội dung trang chủ.');
    } finally {
      setLoading(false);
    }
  };
  // The initial request synchronizes this client view with the protected server resource.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);

  const saveMeta = async () => {
    if (!page) return;
    setSavingMeta(true);
    setMessage('');
    const response = await fetch('/api/admin/pages/home', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ seoTitle: page.seoTitle, seoDescription: page.seoDescription }),
    });
    const data = await response.json();
    setSavingMeta(false);
    if (!response.ok) { setMessage(data.error || 'Không thể lưu SEO.'); return; }
    setMessage('Đã lưu SEO (bản nháp).');
  };

  const saveSection = async (section: Section) => {
    setSavingSectionId(section.id);
    setMessage('');
    const response = await fetch(`/api/admin/pages/home/sections/${section.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ visible: section.visible, sortOrder: section.order, props: section.props }),
    });
    const data = await response.json();
    setSavingSectionId(null);
    if (!response.ok) { setMessage(data.error || 'Không thể lưu khối nội dung.'); return; }
    setMessage(`Đã lưu khối "${section.type}" (bản nháp).`);
  };

  const publish = async () => {
    setPublishing(true);
    setMessage('');
    const response = await fetch('/api/admin/pages/home/publish', { method: 'POST' });
    const data = await response.json();
    setPublishing(false);
    if (!response.ok) { setMessage(data.error || 'Không thể xuất bản.'); return; }
    setMessage('Đã xuất bản lên trang chủ công khai.');
    await load();
  };

  const updateSectionField = (id: string, field: keyof SectionProps, value: string) => {
    setSections((prev) => prev.map((section) => (section.id === id ? { ...section, props: { ...section.props, [field]: value } } : section)));
  };

  if (loading) return <main className="p-6">Đang tải nội dung trang chủ…</main>;
  if (!page) return <main className="p-6">Không thể tải trang chủ.</main>;

  return (
    <main className="p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trang chủ</h1>
          <p className="text-sm text-text-muted">Trạng thái hiện tại: {page.status === 'PUBLISHED' ? 'Đã xuất bản' : page.status === 'DRAFT' ? 'Bản nháp' : 'Lưu trữ'}</p>
        </div>
        <div className="flex gap-2">
          <a href="/admin/pages/home/preview" target="_blank" rel="noreferrer" className="rounded-ctrl border px-4 py-2 text-xs font-bold hover:bg-surface-secondary">Xem thử bản nháp</a>
          <button disabled={publishing} onClick={() => void publish()} className="rounded-ctrl bg-primary px-4 py-2 text-xs font-bold text-white disabled:opacity-60">{publishing ? 'Đang xuất bản…' : 'Xuất bản'}</button>
        </div>
      </div>

      {message && <p role="status" className="text-sm text-primary">{message}</p>}

      <section className="space-y-3 rounded-card border bg-white p-4">
        <h2 className="font-bold">SEO trang chủ</h2>
        <div>
          <label className="mb-1 block text-xs font-semibold">Tiêu đề SEO</label>
          <input className="w-full rounded border p-2 text-sm" value={page.seoTitle ?? ''} onChange={(e) => setPage({ ...page, seoTitle: e.target.value })} maxLength={160} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold">Mô tả SEO</label>
          <textarea className="w-full rounded border p-2 text-sm" value={page.seoDescription ?? ''} onChange={(e) => setPage({ ...page, seoDescription: e.target.value })} maxLength={320} />
        </div>
        <button disabled={savingMeta} onClick={() => void saveMeta()} className="rounded-ctrl bg-primary px-4 py-2 text-xs font-bold text-white disabled:opacity-60">{savingMeta ? 'Đang lưu…' : 'Lưu SEO'}</button>
      </section>

      <section className="space-y-4">
        {sections.sort((a, b) => a.order - b.order).map((section) => (
          <div key={section.id} className="space-y-3 rounded-card border bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{section.type}</h3>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={section.visible} onChange={(e) => setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, visible: e.target.checked } : s)))} />
                  Hiển thị
                </label>
                <label className="flex items-center gap-1.5">
                  Thứ tự
                  <input type="number" className="w-16 rounded border p-1" value={section.order} min={0} onChange={(e) => setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, order: Number(e.target.value) } : s)))} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {EDITABLE_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-semibold">{label}</label>
                  <input className="w-full rounded border p-2 text-sm" value={(section.props[key] as string) ?? ''} onChange={(e) => updateSectionField(section.id, key, e.target.value)} />
                </div>
              ))}
            </div>

            <button disabled={savingSectionId === section.id} onClick={() => void saveSection(section)} className="rounded-ctrl border px-4 py-2 text-xs font-bold hover:bg-surface-secondary disabled:opacity-60">
              {savingSectionId === section.id ? 'Đang lưu…' : 'Lưu khối này'}
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}

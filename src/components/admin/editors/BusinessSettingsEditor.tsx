'use client';

import { useEffect, useState } from 'react';
import type { SiteConfig as Settings } from '@/lib/site-config-schema';

function Field({ label, className = '', children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1 block font-semibold text-text-main">{label}</span>
      {children}
    </label>
  );
}

const inputClass = 'w-full rounded-ctrl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-card border border-gray-200 bg-white p-5">
      <h2 className="text-sm font-bold text-text-main">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function BusinessSettingsEditor() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể tải cài đặt.');
      setSettings(data.settings);
      setSavedSnapshot(JSON.stringify(data.settings));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Không thể tải cài đặt.');
    } finally {
      setLoading(false);
    }
  };

  // The initial request synchronizes this client view with the protected server resource.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((current) => current ? { ...current, [key]: value } : current);
  };

  const updateContact = (key: 'hotlines' | 'zaloNumbers', index: number, value: string) => {
    setSettings((current) => {
      if (!current) return current;
      const next = [...current[key]];
      next[index] = value;
      return { ...current, [key]: next };
    });
  };

  const isDirty = settings !== null && JSON.stringify(settings) !== savedSnapshot;

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setError('');
    setSuccess('');
    // Blank lines never become empty-string rows in the DB — trim + filter
    // out blanks first, so an operator clearing the whole branchAddresses
    // textarea persists as [] (schema-valid), not [''].
    const payload = {
      ...settings,
      emails: settings.emails.map((email) => email.trim()).filter(Boolean),
      branchAddresses: settings.branchAddresses.map((address) => address.trim()).filter(Boolean),
      socials: {
        facebook: settings.socials.facebook?.trim() || undefined,
        tiktok: settings.socials.tiktok?.trim() || undefined,
      },
    };
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Không thể lưu cài đặt.');
      // Use the server's response as the new source of truth (not the local
      // draft) — it reflects exactly what was persisted.
      setSettings(data.settings);
      setSavedSnapshot(JSON.stringify(data.settings));
      setSuccess('Đã lưu vào PostgreSQL.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Không thể lưu cài đặt.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="p-6"><p className="text-sm text-text-muted">Đang tải cài đặt…</p></main>;
  if (!settings) return <main className="space-y-3 p-6"><p role="alert" className="text-sm text-red-600">{error || 'Không thể tải cài đặt.'}</p><button className="rounded-ctrl border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-surface-secondary" onClick={() => void load()}>Thử lại</button></main>;

  return (
    <main className="mx-auto max-w-3xl space-y-5 p-4 pb-28 md:p-6 md:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Cài đặt chung</h1>
        <p className="text-sm text-text-muted">Các giá trị này được lưu trong PostgreSQL và dùng cho website công khai.</p>
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {success && <p role="status" className="text-sm text-primary">{success}</p>}

      <Section title="Thương hiệu">
        <Field label="Tên thương hiệu"><input className={inputClass} value={settings.brandName} onChange={(e) => update('brandName', e.target.value)} /></Field>
        <Field label="Mã số thuế"><input className={inputClass} value={settings.businessCode} onChange={(e) => update('businessCode', e.target.value)} /></Field>
        <Field label="Slogan" className="sm:col-span-2"><input className={inputClass} value={settings.slogan} onChange={(e) => update('slogan', e.target.value)} /></Field>
      </Section>

      <Section title="Liên hệ">
        <Field label="Hotline chính"><input className={inputClass} value={settings.hotlines[0] ?? ''} onChange={(e) => updateContact('hotlines', 0, e.target.value)} /></Field>
        <Field label="Hotline phụ"><input className={inputClass} value={settings.hotlines[1] ?? ''} onChange={(e) => updateContact('hotlines', 1, e.target.value)} /></Field>
        <Field label="Zalo chính"><input className={inputClass} value={settings.zaloNumbers[0] ?? ''} onChange={(e) => updateContact('zaloNumbers', 0, e.target.value)} /></Field>
        <Field label="Zalo phụ"><input className={inputClass} value={settings.zaloNumbers[1] ?? ''} onChange={(e) => updateContact('zaloNumbers', 1, e.target.value)} /></Field>
        <Field label="Email (mỗi dòng một địa chỉ)" className="sm:col-span-2"><textarea className={`${inputClass} min-h-20`} value={settings.emails.join('\n')} onChange={(e) => update('emails', e.target.value.split('\n'))} /></Field>
      </Section>

      <Section title="Địa chỉ">
        <Field label="Địa chỉ trụ sở" className="sm:col-span-2"><input className={inputClass} value={settings.mainAddress} onChange={(e) => update('mainAddress', e.target.value)} /></Field>
        <Field label="Địa chỉ chi nhánh (mỗi dòng một địa chỉ, để trống nếu không có)" className="sm:col-span-2">
          <textarea className={`${inputClass} min-h-24`} value={settings.branchAddresses.join('\n')} onChange={(e) => update('branchAddresses', e.target.value.split('\n'))} />
        </Field>
      </Section>

      <Section title="Mạng xã hội">
        <Field label="Facebook"><input className={inputClass} placeholder="https://facebook.com/..." value={settings.socials.facebook ?? ''} onChange={(e) => update('socials', { ...settings.socials, facebook: e.target.value })} /></Field>
        <Field label="TikTok"><input className={inputClass} placeholder="https://tiktok.com/@..." value={settings.socials.tiktok ?? ''} onChange={(e) => update('socials', { ...settings.socials, tiktok: e.target.value })} /></Field>
      </Section>

      <Section title="Vận hành & chân trang">
        <Field label="Thời gian làm việc" className="sm:col-span-2"><input className={inputClass} value={settings.workingHours} onChange={(e) => update('workingHours', e.target.value)} /></Field>
        <Field label="Cam kết chân trang" className="sm:col-span-2"><textarea className={`${inputClass} min-h-24`} value={settings.footerCommitment} onChange={(e) => update('footerCommitment', e.target.value)} /></Field>
      </Section>

      {/* Sticky save bar: full-width on mobile, doesn't require scrolling back
          to the top after editing a field further down the form. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white p-3 md:sticky md:bottom-4 md:z-auto md:mt-2 md:rounded-card md:border md:shadow-sm md:p-4">
        <button
          disabled={saving || !isDirty}
          className="w-full rounded-ctrl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none md:w-auto"
          onClick={() => void save()}
        >
          {saving ? 'Đang lưu…' : isDirty ? 'Lưu cài đặt' : 'Đã lưu'}
        </button>
      </div>
    </main>
  );
}

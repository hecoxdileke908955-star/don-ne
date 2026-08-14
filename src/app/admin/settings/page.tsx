'use client';

import { useEffect, useState } from 'react';
import type { SiteConfig as Settings } from '@/lib/site-config-schema';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
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

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setError('');
    setSuccess('');
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
      setSettings(data.settings);
      setSuccess('Đã lưu vào PostgreSQL.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Không thể lưu cài đặt.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main className="p-6">Đang tải cài đặt…</main>;
  if (!settings) return <main className="space-y-3 p-6"><p role="alert">{error || 'Không thể tải cài đặt.'}</p><button className="rounded border px-3 py-2" onClick={() => void load()}>Thử lại</button></main>;

  return <main className="max-w-4xl space-y-5 p-6">
    <div><h1 className="text-2xl font-bold">Cài đặt chung</h1><p className="text-sm text-text-muted">Các giá trị này được lưu trong PostgreSQL và dùng cho website công khai.</p></div>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {success && <p role="status" className="text-sm text-primary">{success}</p>}
    <section className="grid gap-4 rounded-card border bg-white p-5 sm:grid-cols-2">
      <label className="text-sm">Tên thương hiệu<input className="mt-1 w-full rounded border p-2" value={settings.brandName} onChange={(event) => update('brandName', event.target.value)} /></label>
      <label className="text-sm">Mã số thuế<input className="mt-1 w-full rounded border p-2" value={settings.businessCode} onChange={(event) => update('businessCode', event.target.value)} /></label>
      <label className="text-sm sm:col-span-2">Slogan<input className="mt-1 w-full rounded border p-2" value={settings.slogan} onChange={(event) => update('slogan', event.target.value)} /></label>
      <label className="text-sm">Hotline chính<input className="mt-1 w-full rounded border p-2" value={settings.hotlines[0] ?? ''} onChange={(event) => updateContact('hotlines', 0, event.target.value)} /></label>
      <label className="text-sm">Hotline phụ<input className="mt-1 w-full rounded border p-2" value={settings.hotlines[1] ?? ''} onChange={(event) => updateContact('hotlines', 1, event.target.value)} /></label>
      <label className="text-sm">Zalo chính<input className="mt-1 w-full rounded border p-2" value={settings.zaloNumbers[0] ?? ''} onChange={(event) => updateContact('zaloNumbers', 0, event.target.value)} /></label>
      <label className="text-sm">Zalo phụ<input className="mt-1 w-full rounded border p-2" value={settings.zaloNumbers[1] ?? ''} onChange={(event) => updateContact('zaloNumbers', 1, event.target.value)} /></label>
      <label className="text-sm sm:col-span-2">Email (mỗi dòng một địa chỉ)<textarea className="mt-1 min-h-20 w-full rounded border p-2" value={settings.emails.join('\n')} onChange={(event) => update('emails', event.target.value.split('\n'))} /></label>
      <label className="text-sm sm:col-span-2">Địa chỉ trụ sở<input className="mt-1 w-full rounded border p-2" value={settings.mainAddress} onChange={(event) => update('mainAddress', event.target.value)} /></label>
      <label className="text-sm sm:col-span-2">Địa chỉ chi nhánh (mỗi dòng một địa chỉ)<textarea className="mt-1 min-h-24 w-full rounded border p-2" value={settings.branchAddresses.join('\n')} onChange={(event) => update('branchAddresses', event.target.value.split('\n'))} /></label>
      <label className="text-sm">Facebook<input className="mt-1 w-full rounded border p-2" value={settings.socials.facebook ?? ''} onChange={(event) => update('socials', { ...settings.socials, facebook: event.target.value })} /></label>
      <label className="text-sm">TikTok<input className="mt-1 w-full rounded border p-2" value={settings.socials.tiktok ?? ''} onChange={(event) => update('socials', { ...settings.socials, tiktok: event.target.value })} /></label>
      <label className="text-sm sm:col-span-2">Thời gian làm việc<input className="mt-1 w-full rounded border p-2" value={settings.workingHours} onChange={(event) => update('workingHours', event.target.value)} /></label>
      <label className="text-sm sm:col-span-2">Cam kết chân trang<textarea className="mt-1 min-h-24 w-full rounded border p-2" value={settings.footerCommitment} onChange={(event) => update('footerCommitment', event.target.value)} /></label>
    </section>
    <button disabled={saving} className="rounded-ctrl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50" onClick={() => void save()}>{saving ? 'Đang lưu…' : 'Lưu cài đặt'}</button>
  </main>;
}

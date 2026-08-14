'use client';

import { useEffect, useState } from 'react';

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
type AdminUser = { id: string; fullName: string; email: string; role: Role; isActive: boolean; createdAt: string };
const blankDraft = { fullName: '', email: '', password: '', role: 'EDITOR' as Role };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(blankDraft);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (!response.ok) throw new Error();
      setUsers(data.users);
    } catch { setMessage('Không thể tải danh sách quản trị viên.'); } finally { setLoading(false); }
  };
  // The initial request synchronizes this client view with the protected server resource.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);

  const createUser = async () => {
    setSaving(true); setMessage('');
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(draft),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) { setMessage(data.error || 'Không thể tạo quản trị viên.'); return; }
    setMessage('Đã tạo quản trị viên mới.');
    setDraft(blankDraft);
    setCreating(false);
    await load();
  };

  const updateUser = async (id: string, patch: Partial<{ role: Role; isActive: boolean }>) => {
    setMessage('');
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || 'Không thể cập nhật quản trị viên.'); return; }
    await load();
  };

  if (loading) return <main className="p-6">Đang tải quản trị viên…</main>;

  return (
    <main className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản trị viên</h1>
          <p className="text-sm text-text-muted">Tài khoản quản trị được lưu trong PostgreSQL.</p>
        </div>
        <button className="rounded-ctrl bg-primary px-4 py-2 text-sm font-bold text-white" onClick={() => setCreating(true)}>Tạo quản trị viên</button>
      </div>

      {message && <p role="status" className="text-sm text-primary">{message}</p>}

      {creating && (
        <section className="space-y-3 rounded-card border bg-white p-4">
          <h2 className="font-bold">Tạo quản trị viên</h2>
          <input className="w-full rounded border p-2" value={draft.fullName} placeholder="Họ tên" onChange={e => setDraft({ ...draft, fullName: e.target.value })} />
          <input className="w-full rounded border p-2" value={draft.email} placeholder="Email" onChange={e => setDraft({ ...draft, email: e.target.value })} />
          <input className="w-full rounded border p-2" type="password" value={draft.password} placeholder="Mật khẩu ban đầu (tối thiểu 12 ký tự)" onChange={e => setDraft({ ...draft, password: e.target.value })} />
          <div className="flex gap-3">
            <select className="rounded border p-2" value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value as Role })}>
              <option value="EDITOR">EDITOR</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
            <button disabled={saving} className="rounded-ctrl bg-primary px-4 py-2 text-sm font-bold text-white" onClick={() => void createUser()}>{saving ? 'Đang lưu…' : 'Lưu'}</button>
            <button className="px-3" onClick={() => { setCreating(false); setDraft(blankDraft); }}>Hủy</button>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-card border bg-white">
        <div className="divide-y">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-bold">{user.fullName}</p>
                <p className="text-xs text-text-muted">{user.email} · {user.isActive ? 'Đang hoạt động' : 'Đã khóa'} · Tạo ngày {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
              <div className="flex items-center gap-2">
                <select className="rounded border p-1 text-sm" value={user.role} onChange={e => void updateUser(user.id, { role: e.target.value as Role })}>
                  <option value="EDITOR">EDITOR</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
                <button className="rounded border px-3 py-1 text-sm" onClick={() => void updateUser(user.id, { isActive: !user.isActive })}>
                  {user.isActive ? 'Khóa' : 'Kích hoạt'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

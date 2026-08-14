'use client';

import { useEffect, useState } from 'react';

type Status = 'NEW' | 'CONTACTED' | 'QUOTED' | 'WON' | 'LOST';
type Lead = { id: string; leadCode: string; customerName: string; phone: string; district: string | null; status: Status; serviceName: string | null; service: { title: string } | null };
const statuses: Status[] = ['NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST'];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { fetch('/api/admin/leads').then(async r => { if (!r.ok) throw new Error(); return r.json(); }).then(d => setLeads(d.leads)).catch(() => setError('Không thể tải dữ liệu Lead.')); }, []);
  async function updateStatus(id: string, status: Status) {
    const response = await fetch(`/api/admin/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (!response.ok) return setError('Không thể cập nhật trạng thái Lead.');
    setLeads(current => current.map(lead => lead.id === id ? { ...lead, status } : lead));
  }
  return <div className="p-6 md:p-8 space-y-6"><div><h1 className="text-2xl font-bold text-text-main">Quản Lý Lead & Đơn Hàng CRM</h1><p className="text-xs text-text-muted">Dữ liệu Lead được đọc trực tiếp từ cơ sở dữ liệu.</p></div>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<div className="overflow-hidden rounded-card border border-gray-200 bg-white shadow-sm"><table className="w-full text-left text-xs"><thead><tr><th className="p-4">Mã Lead</th><th className="p-4">Khách hàng</th><th className="p-4">Dịch vụ</th><th className="p-4">Khu vực</th><th className="p-4">Trạng thái</th></tr></thead><tbody>{leads.map(lead => <tr key={lead.id} className="border-t"><td className="p-4 font-mono">{lead.leadCode}</td><td className="p-4"><b>{lead.customerName}</b><br />{lead.phone}</td><td className="p-4">{lead.service?.title ?? lead.serviceName ?? 'Chưa chọn'}</td><td className="p-4">{lead.district ?? '—'}</td><td className="p-4"><select value={lead.status} onChange={event => updateStatus(lead.id, event.target.value as Status)}>{statuses.map(status => <option key={status} value={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div></div>;
}

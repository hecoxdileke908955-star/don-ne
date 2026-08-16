import React from 'react';
import Link from 'next/link';
import { requireAdminSession } from '@/lib/admin-authorization';
import { verifyPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getVnDateBoundaries } from '@/lib/vn-date';

const VN_LOCALE_OPTS = { timeZone: 'Asia/Ho_Chi_Minh' } as const;
const formatVnd = (value: number) => `${value.toLocaleString('vi-VN')}đ`;
const formatDateTime = (value: Date) => value.toLocaleString('vi-VN', VN_LOCALE_OPTS);

/** Raw `Lead.utmSource`/`Lead.landingPage` values → a display label. Only the
 * literal `"direct"` string (the actual fallback /api/quote writes) is
 * normalized to "Trực tiếp" — anything else null/blank is a genuinely
 * unknown source, not assumed to be direct traffic. */
function labelUtmSource(value: string | null): string {
  if (!value || !value.trim()) return 'Không xác định';
  return value.trim() === 'direct' ? 'Trực tiếp' : value.trim();
}
function labelLandingPage(value: string | null): string {
  return value && value.trim() ? value.trim() : 'Không xác định';
}

interface DashboardData {
  leadsToday: number;
  leadsYesterday: number;
  leadsWeek: number;
  hotlineClicksToday: number;
  zaloClicksToday: number;
  // Admin-only (undefined for EDITOR — never queried, not just hidden).
  wonWeek?: number;
  revenueWeek?: number;
  leadSource?: Array<{ label: string; count: number }>;
  topLandingPages?: Array<{ label: string; count: number }>;
  recentLeads?: Array<{ leadCode: string; customerName: string; serviceLabel: string; status: string; createdAt: Date }>;
}

async function loadDashboardData(isAdminView: boolean): Promise<DashboardData> {
  const { startToday, startTomorrow, startYesterday, startWeek } = getVnDateBoundaries();
  const now = new Date();

  const [leadsToday, leadsYesterday, leadsWeek, hotlineClicksToday, zaloClicksToday] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: startToday, lt: startTomorrow } } }),
    prisma.lead.count({ where: { createdAt: { gte: startYesterday, lt: startToday } } }),
    prisma.lead.count({ where: { createdAt: { gte: startWeek, lte: now } } }),
    prisma.trafficEvent.count({ where: { eventName: 'phone_click', createdAt: { gte: startToday, lt: startTomorrow } } }),
    prisma.trafficEvent.count({ where: { eventName: 'zalo_click', createdAt: { gte: startToday, lt: startTomorrow } } }),
  ]);

  const base: DashboardData = { leadsToday, leadsYesterday, leadsWeek, hotlineClicksToday, zaloClicksToday };
  if (!isAdminView) return base;

  const weekWhere = { createdAt: { gte: startWeek, lte: now } };
  const [wonWeek, revenueAgg, sourceGroups, landingGroups, recentLeadsRaw] = await Promise.all([
    prisma.lead.count({ where: { ...weekWhere, status: 'WON' } }),
    prisma.lead.aggregate({ where: { ...weekWhere, status: 'WON' }, _sum: { finalOrderValue: true } }),
    prisma.lead.groupBy({ by: ['utmSource'], where: weekWhere, _count: { _all: true } }),
    prisma.lead.groupBy({ by: ['landingPage'], where: weekWhere, _count: { _all: true } }),
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { leadCode: true, customerName: true, status: true, createdAt: true, serviceName: true, service: { select: { title: true } } },
    }),
  ]);

  // Merge groups that normalize to the same display label (e.g. null and '' both → "Không xác định").
  const mergeGroups = (groups: Array<{ count: number; label: string }>) => {
    const merged = new Map<string, number>();
    for (const { label, count } of groups) merged.set(label, (merged.get(label) ?? 0) + count);
    return [...merged.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
  };

  return {
    ...base,
    wonWeek,
    revenueWeek: Number(revenueAgg._sum.finalOrderValue ?? 0),
    leadSource: mergeGroups(sourceGroups.map((g) => ({ label: labelUtmSource(g.utmSource), count: g._count._all }))),
    topLandingPages: mergeGroups(landingGroups.map((g) => ({ label: labelLandingPage(g.landingPage), count: g._count._all }))).slice(0, 5),
    recentLeads: recentLeadsRaw.map((lead) => ({
      leadCode: lead.leadCode,
      customerName: lead.customerName,
      serviceLabel: lead.service?.title ?? lead.serviceName ?? 'Chưa chọn',
      status: lead.status,
      createdAt: lead.createdAt,
    })),
  };
}

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const isAdminView = !!session && verifyPermission(session.role, 'ADMIN');

  let data: DashboardData | null = null;
  let loadFailed = false;
  try {
    data = await loadDashboardData(isAdminView);
  } catch {
    loadFailed = true;
  }

  const delta = data ? data.leadsToday - data.leadsYesterday : 0;
  const deltaLabel = delta === 0 ? '0 so với hôm qua' : delta > 0 ? `+${delta} so với hôm qua` : `${delta} so với hôm qua`;
  const totalWeekForRate = data?.leadsWeek ?? 0;
  const closeRate = data && isAdminView && totalWeekForRate > 0 ? ((data.wonWeek ?? 0) / totalWeekForRate) * 100 : 0;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Trung Tâm Vận Hành</h1>
          <p className="text-xs text-text-muted">Số liệu Lead &amp; sự kiện đọc trực tiếp từ cơ sở dữ liệu.</p>
        </div>
        {isAdminView && (
          <div className="flex gap-2">
            <Link href="/admin/leads" className="rounded-ctrl bg-primary px-4 py-2 text-xs font-bold text-white shadow hover:bg-primary-hover">Xem Danh Sách Lead</Link>
          </div>
        )}
      </div>

      {loadFailed || !data ? (
        <div className="rounded-card border border-dashed border-red-200 bg-red-50 p-8 text-center">
          <p role="alert" className="text-sm font-semibold text-red-700">Không thể tải dữ liệu Dashboard lúc này.</p>
          <p className="mt-1 text-xs text-red-600">Vui lòng thử tải lại trang.</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-card bg-white p-5 border border-gray-200 shadow-sm">
              <span className="text-xs text-text-muted">Lead Hôm Nay</span>
              <div className="text-3xl font-black text-text-main mt-1">{data.leadsToday}</div>
              <span className={`text-[11px] font-semibold ${delta > 0 ? 'text-green-700' : delta < 0 ? 'text-red-700' : 'text-text-muted'}`}>{deltaLabel}</span>
            </div>
            <div className="rounded-card bg-white p-5 border border-gray-200 shadow-sm">
              <span className="text-xs text-text-muted">Lead Tuần Này</span>
              <div className="text-3xl font-black text-text-main mt-1">{data.leadsWeek}</div>
              <span className="text-[11px] text-text-muted">Từ đầu tuần (Thứ Hai) đến nay</span>
            </div>
            <div className="rounded-card bg-white p-5 border border-gray-200 shadow-sm">
              <span className="text-xs text-text-muted">Click Gọi Hotline Hôm Nay</span>
              <div className="text-3xl font-black text-primary mt-1">{data.hotlineClicksToday}</div>
            </div>
            <div className="rounded-card bg-white p-5 border border-gray-200 shadow-sm">
              <span className="text-xs text-text-muted">Click Zalo Hôm Nay</span>
              <div className="text-3xl font-black text-[#0068FF] mt-1">{data.zaloClicksToday}</div>
            </div>
          </div>

          {isAdminView && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-card bg-white p-5 border border-gray-200 shadow-sm">
                  <span className="text-xs text-text-muted">Lead Tạo Tuần Này Đã Chốt</span>
                  <div className="text-2xl font-black text-text-main mt-1">{data.wonWeek}</div>
                </div>
                <div className="rounded-card bg-white p-5 border border-gray-200 shadow-sm">
                  <span className="text-xs text-text-muted">Giá Trị Chốt Của Lead Tạo Tuần Này</span>
                  <div className="text-2xl font-black text-text-main mt-1">{formatVnd(data.revenueWeek ?? 0)}</div>
                </div>
                <div className="rounded-card bg-white p-5 border border-gray-200 shadow-sm">
                  <span className="text-xs text-text-muted">Tỷ Lệ Chốt Của Lead Tạo Tuần Này</span>
                  <div className="text-2xl font-black text-text-main mt-1">{closeRate.toFixed(1)}%</div>
                  <span className="text-[11px] text-text-muted">Tính trên Lead được tạo từ đầu tuần.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-card bg-white p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-text-main mb-4">Nguồn Lead (Tuần Này)</h3>
                  {data.leadSource && data.leadSource.length > 0 ? (
                    <div className="space-y-3 text-xs">
                      {data.leadSource.map(({ label, count }) => {
                        const pct = data.leadsWeek > 0 ? (count / data.leadsWeek) * 100 : 0;
                        return (
                          <div key={label}>
                            <div className="flex justify-between font-semibold text-text-main mb-1">
                              <span>{label}</span>
                              <span>{count} Lead ({pct.toFixed(0)}%)</span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : <p className="text-xs text-text-muted">Chưa có Lead nào trong tuần này.</p>}
                </div>

                <div className="rounded-card bg-white p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-text-main mb-4">Top Landing Page (Tuần Này)</h3>
                  {data.topLandingPages && data.topLandingPages.length > 0 ? (
                    <ul className="space-y-3 text-xs divide-y divide-gray-100">
                      {data.topLandingPages.map(({ label, count }) => {
                        const pct = data.leadsWeek > 0 ? (count / data.leadsWeek) * 100 : 0;
                        return (
                          <li key={label} className="pt-2 flex items-center justify-between">
                            <span className="font-semibold text-text-main">{label}</span>
                            <span className="text-primary font-bold">{count} leads ({pct.toFixed(1)}%)</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : <p className="text-xs text-text-muted">Chưa có Lead nào trong tuần này.</p>}
                </div>
              </div>

              <div className="rounded-card bg-white border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-text-main">Lead Gần Đây</h3>
                  <Link href="/admin/leads" className="text-xs font-semibold text-primary hover:underline">Xem tất cả Lead →</Link>
                </div>
                {data.recentLeads && data.recentLeads.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {data.recentLeads.map((lead) => (
                      <div key={lead.leadCode} className="flex items-center justify-between gap-3 p-4 text-xs">
                        <div>
                          <p className="font-mono text-text-muted">{lead.leadCode}</p>
                          <p className="font-bold text-text-main">{lead.customerName}</p>
                          <p className="text-text-muted">{lead.serviceLabel}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-text-main">{lead.status}</p>
                          <p className="text-text-muted">{formatDateTime(lead.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="p-4 text-xs text-text-muted">Chưa có Lead nào.</p>}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

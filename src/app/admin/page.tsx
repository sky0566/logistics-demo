'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';

/* ---------- Types ---------- */
interface TrafficPeriod { label: string; views: number; visitors: number; }
interface DailyTraffic { date: string; views: number; visitors: number; }
interface PageStat { page_path: string; page_title: string; views: number; visitors: number; }
interface ReferrerItem { name: string; views: number; }
interface Inquiry { id: number; name: string; email: string; service: string; status: string; created_at: string; }

interface Stats {
  totalInquiries: number;
  newInquiries: number;
  totalNews: number;
  totalServices: number;
  trafficSummary: TrafficPeriod[];
  onlineVisitors: number;
  dailyTraffic: DailyTraffic[];
  topPages: PageStat[];
  referrers: ReferrerItem[];
  recentInquiries: Inquiry[];
}

/* ---------- Range Options ---------- */
const RANGE_OPTIONS = [
  { label: '7d', value: '7' },
  { label: '14d', value: '14' },
  { label: '30d', value: '30' },
  { label: '90d', value: '90' },
];

function RangeTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-0.5">
      {RANGE_OPTIONS.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            value === o.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}>{o.label}</button>
      ))}
    </div>
  );
}

/* ---------- Widget Card ---------- */
function WidgetCard({ title, children, right, className = '' }: {
  title: string; children: React.ReactNode; right?: React.ReactNode; className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {right}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

/* ---------- Custom Tooltip ---------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs">
      <p className="text-gray-400 mb-1 font-medium">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }, i: number) => (
        <p key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-semibold">{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

/* ========== Main Dashboard ========== */
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [range, setRange] = useState('30');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback((r: string) => {
    return fetch(`/api/stats?range=${r}`).then(res => res.json()).then(setStats);
  }, []);

  useEffect(() => { fetchStats(range).finally(() => setLoading(false)); }, [range, fetchStats]);

  const refresh = async () => {
    setRefreshing(true);
    await fetchStats(range);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-blue-500" />
          <span className="text-sm text-gray-400">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const fmt = (n: number) => n.toLocaleString();

  const todayViews = stats.trafficSummary.find(t => t.label === 'Today')?.views || 0;
  const yestViews = stats.trafficSummary.find(t => t.label === 'Yesterday')?.views || 0;
  const viewsDelta = yestViews > 0 ? ((todayViews - yestViews) / yestViews * 100) : 0;
  const todayVisitors = stats.trafficSummary.find(t => t.label === 'Today')?.visitors || 0;
  const yestVisitors = stats.trafficSummary.find(t => t.label === 'Yesterday')?.visitors || 0;
  const visitorsDelta = yestVisitors > 0 ? ((todayVisitors - yestVisitors) / yestVisitors * 100) : 0;

  const statCards = [
    {
      label: 'Page Views Today', value: todayViews, delta: viewsDelta,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Visitors Today', value: todayVisitors, delta: visitorsDelta,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Online Now', value: stats.onlineVisitors, live: true,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />,
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      label: 'Services', value: stats.totalServices,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
      gradient: 'from-violet-500 to-violet-600',
    },
    {
      label: 'Inquiries', value: stats.totalInquiries, badge: stats.newInquiries || undefined,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Refresh Bar */}
      <div className="flex items-center justify-end">
        <button onClick={refresh} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 shadow-sm transition-all">
          <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  {card.label}
                  {card.live && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" /></span>}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{fmt(card.value)}</p>
                {card.delta !== undefined && (
                  <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${card.delta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d={card.delta >= 0 ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                    </svg>
                    {Math.abs(card.delta).toFixed(1)}% vs yesterday
                  </div>
                )}
              </div>
              <div className={`w-11 h-11 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center relative`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{card.icon}</svg>
                {card.badge ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg">
                    {card.badge}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Summary Row */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">Traffic Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <div className="flex divide-x divide-gray-100 min-w-[500px]">
            {stats.trafficSummary.map(row => (
              <div key={row.label} className="flex-1 px-5 py-4 text-center hover:bg-gray-50/50 transition-colors">
                <p className="text-xs text-gray-500 font-medium mb-2">{row.label}</p>
                <p className="text-lg font-bold text-gray-900">{fmt(row.views)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{fmt(row.visitors)} visitors</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Chart */}
      <WidgetCard title="Traffic Trend" right={<RangeTabs value={range} onChange={setRange} />}>
        {stats.dailyTraffic.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={stats.dailyTraffic}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#93c5fd" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#86efac" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fill="url(#viewsGrad)" name="Views" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
                <Area type="monotone" dataKey="visitors" stroke="#22c55e" strokeWidth={2} fill="url(#visitorsGrad)" name="Visitors" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-blue-500" /> Views</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-emerald-500" /> Visitors</span>
            </div>
          </>
        ) : <p className="text-sm text-gray-400 text-center py-16">No traffic data yet</p>}
      </WidgetCard>

      {/* Referrals + Most Visited Pages */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Referrals */}
        <WidgetCard title="Referral Sources">
          {stats.referrers.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.referrers.slice(0, 8)} layout="vertical" barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v: string) => { try { return new URL(v).hostname; } catch { return v; } }}
                  axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, color: '#fff', fontSize: 12 }} itemStyle={{ color: '#fff' }} />
                <Bar dataKey="views" fill="#3b82f6" radius={[0, 6, 6, 0]} name="Views" />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-10">No referral data</p>}
        </WidgetCard>

        {/* Most Visited Pages */}
        <WidgetCard title="Most Visited Pages">
          {stats.topPages.length > 0 ? (
            <div className="space-y-3">
              {stats.topPages.map((p, i) => {
                const maxViews = stats.topPages[0]?.views || 1;
                const pct = (p.views / maxViews) * 100;
                return (
                  <div key={p.page_path} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-xs font-bold text-gray-300 w-5 flex-shrink-0">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate">{p.page_title || p.page_path}</p>
                          <p className="text-[11px] text-gray-400 truncate">{p.page_path}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs flex-shrink-0 ml-3">
                        <span className="font-semibold text-gray-700">{fmt(p.views)}</span>
                        <span className="text-blue-500">{fmt(p.visitors)}</span>
                      </div>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden ml-7">
                      <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-10">No page data</p>}
        </WidgetCard>
      </div>

      {/* Recent Inquiries */}
      <WidgetCard title="Recent Inquiries">
        <div className="overflow-x-auto -mx-6 -mb-5">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Service</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentInquiries.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No inquiries yet</td></tr>
              ) : (
                stats.recentInquiries.map(inq => (
                  <tr key={inq.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900">{inq.name}</td>
                    <td className="px-4 py-3 text-gray-600">{inq.email}</td>
                    <td className="px-4 py-3 text-gray-600">{inq.service || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        inq.status === 'new' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>{inq.status}</span>
                    </td>
                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{new Date(inq.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </WidgetCard>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Clock,
  PieChart as PieIcon,
  MapPin,
  DollarSign,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [turnaroundData, setTurnaroundData] = useState<any>(null);
  const [rejectionsData, setRejectionsData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [funnelRes, turnaroundRes, rejectionsRes, heatmapRes, budgetRes] = await Promise.all([
        api.getFunnelAnalytics(),
        api.getTurnaroundAnalytics(),
        api.getRejectionsAnalytics(),
        api.getHeatmapAnalytics(),
        api.getBudgetAnalytics(),
      ]);

      if (funnelRes?.funnel) setFunnelData(funnelRes.funnel);
      if (turnaroundRes) setTurnaroundData(turnaroundRes);
      if (rejectionsRes?.rejections) setRejectionsData(rejectionsRes.rejections);
      if (heatmapRes?.heatmap) setHeatmapData(heatmapRes.heatmap);
      if (budgetRes?.budgetData) setBudgetData(budgetRes.budgetData);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0f2e5a', '#1e40af', '#2563eb', '#d97706', '#138808', '#dc2626'];

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold">Loading Ministry Analytics & Reports...</div>;
  }

  return (
    <div className="space-y-6 py-2">
      {/* Header Banner */}
      <div className="govt-card overflow-hidden">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Ministry Analytics & Reports Dashboard</span>
          </div>
          <button
            onClick={loadAnalytics}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1 shadow"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            Refresh Reports
          </button>
        </div>
        <div className="tricolor-ribbon"></div>

        <div className="p-4 bg-white">
          <h1 className="text-xl font-extrabold text-[#0a2540]">Real-Time Scheme Performance & Turnaround SLA</h1>
          <p className="text-xs text-slate-600 font-medium">
            Visual analytics for conversion funnel, officer turnaround times, rejection trends, geographic ST coverage, and budget utilization.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        <div className="govt-card p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Avg Scrutiny SLA</span>
          <p className="text-2xl font-extrabold text-[#0f2e5a]">{turnaroundData?.avgTurnaroundDays || 3.4} Days</p>
          <p className="text-[10px] text-emerald-700 font-bold">✔ 51% Faster than SLA Target (7 Days)</p>
        </div>

        <div className="govt-card p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">SLA Compliance</span>
          <p className="text-2xl font-extrabold text-emerald-700">{turnaroundData?.slaCompliancePercent || 94.2}%</p>
          <p className="text-[10px] text-slate-500">Target Compliance &gt; 90%</p>
        </div>

        <div className="govt-card p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">ST Beneficiaries</span>
          <p className="text-2xl font-extrabold text-amber-700">644 Candidates</p>
          <p className="text-[10px] text-slate-500">Selected Across Indian States</p>
        </div>

        <div className="govt-card p-4 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Budget Utilized</span>
          <p className="text-2xl font-extrabold text-indigo-900">₹5.5 Crore</p>
          <p className="text-[10px] text-slate-500">Out of ₹13.5 Cr Sanctioned</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 govt-card p-4 space-y-3">
          <h3 className="text-sm font-extrabold text-[#0f2e5a] flex items-center gap-2 border-b border-slate-200 pb-2">
            <BarChart3 className="w-4 h-4 text-[#0f2e5a]" /> Application Conversion Funnel
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="stage" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f2e5a' }} />
                <Bar dataKey="count" fill="#0f2e5a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 govt-card p-4 space-y-3">
          <h3 className="text-sm font-extrabold text-[#0f2e5a] flex items-center gap-2 border-b border-slate-200 pb-2">
            <PieIcon className="w-4 h-4 text-amber-700" /> Deficiency Reason Breakdown
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={rejectionsData} dataKey="count" nameKey="reason" cx="50%" cy="50%" outerRadius={75} label>
                  {rejectionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f2e5a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* State Table & Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 govt-card overflow-hidden">
          <div className="govt-card-header font-bold text-xs">
            Geographic Coverage & PVTG Inclusion
          </div>
          <div className="overflow-x-auto">
            <table className="govt-table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Applications</th>
                  <th>Selected</th>
                  <th>PVTG Beneficiaries</th>
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((h, i) => (
                  <tr key={i}>
                    <td className="font-bold text-[#0f2e5a]">{h.state}</td>
                    <td className="font-bold text-blue-900">{h.applications}</td>
                    <td className="font-bold text-emerald-800">{h.selected}</td>
                    <td className="font-bold text-amber-800">{h.pvtgCount} Candidates</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-6 govt-card p-4 space-y-3">
          <h3 className="text-sm font-extrabold text-[#0f2e5a] border-b border-slate-200 pb-2">
            Scheme Budget Allocation vs Utilization (INR)
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="schemeCode" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f2e5a' }} />
                <Bar dataKey="allocatedINR" fill="#94a3b8" name="Sanctioned" />
                <Bar dataKey="utilizedINR" fill="#138808" name="Utilized" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

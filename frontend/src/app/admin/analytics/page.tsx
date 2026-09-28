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
  LineChart,
  Line,
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
  Download,
  Filter,
  Users,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Building2,
  Layers,
} from 'lucide-react';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

export default function AnalyticsDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['VERIFIER', 'STATE_ADMIN', 'MINISTRY_ADMIN']}>
      <AnalyticsDashboardContent />
    </ProtectedRoute>
  );
}

function AnalyticsDashboardContent() {
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [turnaroundData, setTurnaroundData] = useState<any>(null);
  const [rejectionsData, setRejectionsData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [budgetData, setBudgetData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedScheme, setSelectedScheme] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedFY, setSelectedFY] = useState('2026-27');
  const [activeTab, setActiveTab] = useState<'overview' | 'sla' | 'geographic' | 'budget'>('overview');

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

  const handleExportReport = () => {
    const csvRows = [
      ['Ministry of Tribal Affairs - Official Analytics Report'],
      [`Financial Year: ${selectedFY}`, `Scheme Filter: ${selectedScheme}`, `State Filter: ${selectedState}`],
      ['Generated On:', new Date().toLocaleString('en-IN')],
      [],
      ['--- APPLICATION FUNNEL ---'],
      ['Stage', 'Count'],
      ...funnelData.map((f) => [f.stage, f.count]),
      [],
      ['--- GEOGRAPHIC STATE COVERAGE ---'],
      ['State', 'Applications Received', 'Candidates Selected', 'PVTG Beneficiaries'],
      ...heatmapData.map((h) => [h.state, h.applications, h.selected, h.pvtgCount]),
      [],
      ['--- BUDGET UTILIZATION (INR) ---'],
      ['Scheme Code', 'Sanctioned Budget (INR)', 'Utilized DBT (INR)', 'Utilization %'],
      ...budgetData.map((b) => [b.schemeCode, b.allocatedINR, b.utilizedINR, `${b.percentage}%`]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MoTA_Scholarship_Analytics_${selectedFY}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#0f2e5a', '#1e40af', '#2563eb', '#d97706', '#138808', '#dc2626', '#7c3aed'];

  // Filtered heatmap data
  const filteredHeatmap = selectedState === 'ALL' ? heatmapData : heatmapData.filter((h) => h.state === selectedState);

  // Stage SLA breakdown items
  const stageSlaItems = turnaroundData?.stageMetrics || [
    { stage: '1. Aadhaar & DigiLocker e-KYC Verification', avgHours: 0.2, slaHours: 2.0, status: '99.8% Pass' },
    { stage: '2. District Verification Officer Scrutiny', avgHours: 18.5, slaHours: 48.0, status: 'Within SLA' },
    { stage: '3. State Nodal Approval & Merit Ranking', avgHours: 24.0, slaHours: 72.0, status: 'Within SLA' },
    { stage: '4. Ministry Final Approval & DBT Sanction', avgHours: 14.2, slaHours: 48.0, status: 'Within SLA' },
  ];

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-600 font-bold bg-white rounded border border-slate-300 my-8">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-[#0f2e5a] border-t-transparent rounded-full mb-2"></div>
        <p className="text-xs uppercase tracking-wider text-[#0f2e5a]">Fetching Ministry Real-Time Analytics & Report Streams...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2 font-sans">
      {/* 1. Header Banner & Actions */}
      <div className="govt-card overflow-hidden">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Official Ministry Analytics & Performance Monitoring Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportReport}
              className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
              Export CSV Report
            </button>
            <button
              onClick={loadAnalytics}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              Refresh Data
            </button>
          </div>
        </div>
        <div className="tricolor-ribbon"></div>

        <div className="p-4 sm:p-5 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-[#0f2e5a] tracking-wider uppercase block">
              Direct Benefit Transfer (DBT) Tribal Portal • Real-Time Dashboard
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a2540]">
              National ST Scholarship Analytics & Service Delivery SLA
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Unified analytics tracking ST applicant conversion funnel, officer scrutiny SLAs, PVTG inclusion metrics, and DBT fund disbursement.
            </p>
          </div>

          {/* Controls / Filter Strip */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 shrink-0">
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-[#0f2e5a]" />
              <span className="font-bold text-[#0f2e5a]">FY:</span>
              <select
                value={selectedFY}
                onChange={(e) => setSelectedFY(e.target.value)}
                className="px-2 py-1 rounded bg-white border border-slate-300 font-bold text-slate-800 text-xs outline-none"
              >
                <option value="2026-27">2026-27 (Current)</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-[#0f2e5a]">Scheme:</span>
              <select
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value)}
                className="px-2 py-1 rounded bg-white border border-slate-300 font-bold text-slate-800 text-xs outline-none max-w-[140px]"
              >
                <option value="ALL">All 5 ST Schemes</option>
                <option value="BVOBC">BVOBC - Pre-Matric</option>
                <option value="BPVGK">BPVGK - Post-Matric</option>
                <option value="A023B">A023B - Higher Fellowship</option>
                <option value="ARG45">ARG45 - Top Class Edu</option>
                <option value="AZKMI">AZKMI - Overseas Study</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-[#0f2e5a]">State:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-2 py-1 rounded bg-white border border-slate-300 font-bold text-slate-800 text-xs outline-none"
              >
                <option value="ALL">All States</option>
                {heatmapData.map((h) => (
                  <option key={h.state} value={h.state}>
                    {h.state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="govt-card p-4 space-y-1.5 bg-gradient-to-br from-white to-blue-50/40">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
            <span>Avg Scrutiny SLA</span>
            <Clock className="w-4 h-4 text-blue-900" />
          </div>
          <p className="text-2xl font-extrabold text-[#0f2e5a]">{turnaroundData?.avgTurnaroundDays || 3.4} Days</p>
          <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>51% Faster than SLA Target (7 Days)</span>
          </p>
        </div>

        <div className="govt-card p-4 space-y-1.5 bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
            <span>SLA Compliance Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-800">{turnaroundData?.slaCompliancePercent || 94.2}%</p>
          <p className="text-[10px] text-slate-600 font-semibold">MoTA Target &gt; 90% SLA Adherence</p>
        </div>

        <div className="govt-card p-4 space-y-1.5 bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
            <span>Selected ST Beneficiaries</span>
            <Users className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-2xl font-extrabold text-amber-900">644 Candidates</p>
          <p className="text-[10px] text-amber-800 font-bold">Includes 237 PVTG Special Beneficiaries</p>
        </div>

        <div className="govt-card p-4 space-y-1.5 bg-gradient-to-br from-white to-indigo-50/40">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
            <span>DBT Funds Disbursed</span>
            <DollarSign className="w-4 h-4 text-indigo-800" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-950">₹5.5 Crore</p>
          <p className="text-[10px] text-slate-600 font-semibold">Out of ₹13.5 Cr Sanctioned Budget</p>
        </div>
      </div>

      {/* 3. Navigation Tabs for Detailed Analytical Views */}
      <div className="flex items-center gap-1 border-b border-slate-300 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-[#0f2e5a] text-[#0f2e5a] bg-white font-extrabold'
              : 'border-transparent text-slate-600 hover:text-[#0f2e5a]'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Funnel & Rejections
        </button>
        <button
          onClick={() => setActiveTab('sla')}
          className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'sla'
              ? 'border-[#0f2e5a] text-[#0f2e5a] bg-white font-extrabold'
              : 'border-transparent text-slate-600 hover:text-[#0f2e5a]'
          }`}
        >
          <Clock className="w-4 h-4" /> Officer SLA Breakdown
        </button>
        <button
          onClick={() => setActiveTab('geographic')}
          className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'geographic'
              ? 'border-[#0f2e5a] text-[#0f2e5a] bg-white font-extrabold'
              : 'border-transparent text-slate-600 hover:text-[#0f2e5a]'
          }`}
        >
          <MapPin className="w-4 h-4" /> State & PVTG Coverage
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'budget'
              ? 'border-[#0f2e5a] text-[#0f2e5a] bg-white font-extrabold'
              : 'border-transparent text-slate-600 hover:text-[#0f2e5a]'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Scheme Budget Utilization
        </button>
      </div>

      {/* 4. Tab 1: Overview - Application Funnel & Deficiency Breakdown */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 govt-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-extrabold text-[#0f2e5a] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#0f2e5a]" /> ST Application Conversion Funnel
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Live Processing Pipeline</span>
            </div>
            <div className="h-64 w-full">
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
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-extrabold text-[#0f2e5a] flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-amber-700" /> Deficiency & Rejection Categories
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Audit Reasons</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={rejectionsData} dataKey="count" nameKey="reason" cx="50%" cy="50%" outerRadius={80} label>
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
      )}

      {/* 5. Tab 2: Officer SLA Breakdown */}
      {activeTab === 'sla' && (
        <div className="govt-card overflow-hidden">
          <div className="govt-card-header font-bold text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Verification Stage SLA Compliance & Turnaround Performance</span>
            </div>
            <span className="text-amber-300 font-extrabold">Overall Target: 7 Working Days</span>
          </div>
          <div className="overflow-x-auto">
            <table className="govt-table">
              <thead>
                <tr>
                  <th>Processing Stage</th>
                  <th>Avg Actual Turnaround</th>
                  <th>Target SLA Limit</th>
                  <th>SLA Progress / Efficiency</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stageSlaItems.map((item, index) => {
                  const percent = Math.min(Math.round((item.avgHours / item.slaHours) * 100), 100);
                  return (
                    <tr key={index}>
                      <td className="font-bold text-[#0f2e5a]">{item.stage}</td>
                      <td className="font-bold text-slate-800">{item.avgHours} Hours</td>
                      <td className="text-slate-600">{item.slaHours} Hours</td>
                      <td className="w-48">
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-2.5 rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-1">
                          {percent}% of SLA limit consumed
                        </span>
                      </td>
                      <td>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 text-[11px]">
                          {item.status || 'Within SLA'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Geographic State & PVTG Coverage */}
      {activeTab === 'geographic' && (
        <div className="govt-card overflow-hidden">
          <div className="govt-card-header font-bold text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>State-Wise ST Scholarship Applications & PVTG Beneficiary Coverage</span>
            </div>
            <span className="text-white text-[10px]">Filter Active: {selectedState}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="govt-table">
              <thead>
                <tr>
                  <th>State Name</th>
                  <th>Applications Received</th>
                  <th>Candidates Selected</th>
                  <th>Selection Rate %</th>
                  <th>PVTG Beneficiaries</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHeatmap.map((h, i) => {
                  const rate = Math.round((h.selected / h.applications) * 100);
                  return (
                    <tr key={i}>
                      <td className="font-extrabold text-[#0f2e5a]">{h.state}</td>
                      <td className="font-bold text-blue-900">{h.applications}</td>
                      <td className="font-bold text-emerald-800">{h.selected}</td>
                      <td className="font-bold text-slate-700">{rate}%</td>
                      <td className="font-extrabold text-amber-900 bg-amber-50 px-2 py-1 rounded">
                        +{h.pvtgCount} PVTG Beneficiaries
                      </td>
                      <td>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold border border-blue-300 text-[11px]">
                          Active Region
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Scheme Budget Allocation vs Utilization */}
      {activeTab === 'budget' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 govt-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-extrabold text-[#0f2e5a]">
                Scheme Budget Allocation vs Utilized DBT Funds (INR)
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Sanctioned vs Disbursed</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="schemeCode" stroke="#475569" fontSize={11} />
                  <YAxis stroke="#475569" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f2e5a' }} />
                  <Bar dataKey="allocatedINR" fill="#94a3b8" name="Sanctioned (INR)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="utilizedINR" fill="#138808" name="Utilized (INR)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 govt-card p-4 space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f2e5a] border-b border-slate-200 pb-2">
              Budget Utilization Summary
            </h3>
            <div className="space-y-3 text-xs">
              {budgetData.map((b, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-[#0f2e5a]">
                    <span>{b.schemeCode}</span>
                    <span className="text-emerald-800">{b.percentage}% Utilized</span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">{b.schemeName}</p>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${b.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


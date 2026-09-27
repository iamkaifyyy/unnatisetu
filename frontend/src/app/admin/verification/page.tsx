'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Application } from '../../../types';
import { useLanguage } from '../../../context/LanguageContext';
import {
  ShieldCheck,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  RefreshCw,
  Search,
  CheckSquare,
  AlertCircle,
  X,
  Send,
  UserCheck,
} from 'lucide-react';

export default function VerificationQueuePage() {
  const { t } = useLanguage();
  const [queue, setQueue] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [riskFilter, setRiskFilter] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Inspection Modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activeDoc, setActiveDoc] = useState<any | null>(null);

  // Deficiency Modal State
  const [isDeficiencyModalOpen, setIsDeficiencyModalOpen] = useState(false);
  const [deficiencyReason, setDeficiencyReason] = useState('Income mismatch between uploaded Income Certificate and form entry.');
  const [deficiencyRemarks, setDeficiencyRemarks] = useState('Please re-upload updated Tehsildar income certificate.');

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchQueue();
  }, [riskFilter, stateFilter]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (riskFilter) params.riskLevel = riskFilter;
      if (stateFilter) params.state = stateFilter;
      if (searchQuery) params.search = searchQuery;

      const data = await api.getVerificationQueue(params);
      if (data?.queue) {
        setQueue(data.queue);
      }
    } catch (err) {
      console.error('Error loading queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const openInspection = (app: Application) => {
    setSelectedApp(app);
    if (app.documents && app.documents.length > 0) {
      setActiveDoc(app.documents[0]);
    } else {
      setActiveDoc(null);
    }
  };

  const handleAction = async (action: 'APPROVE' | 'RAISE_DEFICIENCY' | 'REJECT' | 'ESCALATE') => {
    if (!selectedApp) return;

    if (action === 'RAISE_DEFICIENCY') {
      setIsDeficiencyModalOpen(true);
      return;
    }

    try {
      await api.processVerificationAction(selectedApp.id, {
        action,
        reason: `Officer verified and triggered ${action}`,
      });
      alert(`Application ${selectedApp.applicationNo} updated to ${action}`);
      setSelectedApp(null);
      fetchQueue();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const submitDeficiency = async () => {
    if (!selectedApp) return;
    try {
      await api.processVerificationAction(selectedApp.id, {
        action: 'RAISE_DEFICIENCY',
        reason: deficiencyReason,
        deficiencyRemarks,
      });
      alert(`Deficiency notice issued for ${selectedApp.applicationNo}`);
      setIsDeficiencyModalOpen(false);
      setSelectedApp(null);
      fetchQueue();
    } catch (err: any) {
      alert(err.message || 'Deficiency submission failed');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === queue.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(queue.map((q) => q.id));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    try {
      await api.processBulkAction({
        applicationIds: selectedIds,
        action: 'APPROVE',
        reason: 'Bulk approved high-confidence applications during scrutiny',
      });
      alert(`Bulk approved ${selectedIds.length} applications!`);
      setSelectedIds([]);
      fetchQueue();
    } catch (err: any) {
      alert(err.message || 'Bulk approve failed');
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Top Banner */}
      <div className="govt-card overflow-hidden">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{t.verificationQueue} • District & State Authorities</span>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkApprove}
              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow"
            >
              <CheckCircle2 className="w-4 h-4" />
              {t.bulkApprove} ({selectedIds.length})
            </button>
          )}
        </div>
        <div className="tricolor-ribbon"></div>

        <div className="p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-[#0a2540]">{t.scrutinyQueueTitle}</h1>
            <p className="text-xs text-slate-600">
              Scrutinize ST fellowship applications, inspect OCR field mismatches, and issue official deficiency notices.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="govt-card p-4 flex flex-wrap items-center justify-between gap-4 text-xs bg-slate-50">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="font-bold text-[#0f2e5a]">{t.riskLevel}:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-1.5 rounded bg-white border border-slate-300 text-slate-800 outline-none font-medium"
            >
              <option value="">All Risk Levels</option>
              <option value="HIGH">High Risk (CRITICAL Mismatch)</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk (High Confidence)</option>
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search App No or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchQueue()}
            className="w-full pl-9 pr-3 py-1.5 rounded bg-white border border-slate-300 text-slate-800 outline-none text-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="govt-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-bold">Loading scrutiny queue...</div>
        ) : queue.length === 0 ? (
          <div className="p-8 text-center text-slate-600 font-bold">Queue clean! No pending applications.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="govt-table">
              <thead>
                <tr>
                  <th className="w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === queue.length}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th>{t.appNo}</th>
                  <th>{t.candidateName}</th>
                  <th>State & Tribe</th>
                  <th>{t.ocrScore}</th>
                  <th>{t.riskLevel}</th>
                  <th>Status</th>
                  <th className="text-right">{t.action}</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((app) => (
                  <tr key={app.id}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(app.id)}
                        onChange={() => {
                          setSelectedIds((prev) =>
                            prev.includes(app.id) ? prev.filter((i) => i !== app.id) : [...prev, app.id]
                          );
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="font-extrabold text-[#0f2e5a]">{app.applicationNo}</td>
                    <td className="font-bold text-slate-800">{app.user?.fullName}</td>
                    <td>
                      {app.user?.state || 'Jharkhand'} • <span className="text-slate-600">{app.formData?.tribeName || 'ST'}</span>
                    </td>
                    <td className="font-extrabold text-emerald-700">{app.aiConfidenceScore}%</td>
                    <td>
                      {app.riskLevel === 'HIGH' && (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-300">
                          HIGH RISK
                        </span>
                      )}
                      {app.riskLevel === 'MEDIUM' && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                          MEDIUM
                        </span>
                      )}
                      {app.riskLevel === 'LOW' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                          LOW RISK
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                        {app.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => openInspection(app)}
                        className="px-3 py-1 rounded bg-[#0f2e5a] hover:bg-[#1a365d] text-white font-bold text-xs flex items-center gap-1 ml-auto shadow"
                      >
                        <Eye className="w-3.5 h-3.5" /> {t.inspectDiff}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

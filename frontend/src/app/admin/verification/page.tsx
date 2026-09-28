'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Application } from '../../../types';
import { useLanguage } from '../../../context/LanguageContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
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
    <ProtectedRoute allowedRoles={['VERIFIER', 'STATE_ADMIN', 'MINISTRY_ADMIN']}>
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

        {/* Scrutiny Inspection Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="govt-card bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-4 p-6 shadow-2xl relative border-2 border-[#0f2e5a]">
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold text-[#0a2540]">
                    Scrutiny Inspection: <span className="text-[#0f2e5a]">{selectedApp.applicationNo}</span>
                  </h2>
                  <p className="text-xs text-slate-600">
                    Applicant: <strong>{selectedApp.user?.fullName}</strong> ({selectedApp.user?.state}) • Risk: <strong className="text-amber-800">{selectedApp.riskLevel}</strong>
                  </p>
                </div>

                <div className="px-3 py-1 rounded bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs">
                  AI-flagged, pending human review
                </div>
              </div>

              {/* Documents tab */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
                  <h3 className="font-extrabold text-[#0f2e5a] uppercase tracking-wider text-[11px]">
                    Attached Documents & Advisory Checks
                  </h3>

                  {selectedApp.documents && selectedApp.documents.length > 0 ? (
                    selectedApp.documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        onClick={() => setActiveDoc(doc)}
                        className={`p-3 rounded border cursor-pointer transition-all ${
                          activeDoc?.id === doc.id ? 'bg-white border-[#0f2e5a] shadow-sm' : 'bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{doc.type}</span>
                          <span className="text-emerald-700">{doc.ocrConfidenceScore}% OCR</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{doc.fileName}</p>

                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {doc.verificationStatus === 'FLAGGED' ? 'AI-flagged, pending human review' : 'System Checked'}
                          </span>
                          <span className="text-[10px] text-blue-900 font-bold hover:underline">Inspect Fields &rarr;</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No documents attached.</p>
                  )}
                </div>

                {/* Form vs Document Extraction Comparison */}
                <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
                  <h3 className="font-extrabold text-[#0f2e5a] uppercase tracking-wider text-[11px]">
                    Form Entry vs. Extracted Document Data
                  </h3>

                  {activeDoc ? (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded bg-white border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-600 block text-[10px] uppercase">Declared Form Income:</span>
                        <span className="font-extrabold text-[#0f2e5a] text-sm">
                          ₹{Number(selectedApp.formData?.annualIncome || 240000).toLocaleString('en-IN')} / yr
                        </span>
                      </div>

                      <div className="p-2.5 rounded bg-white border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-600 block text-[10px] uppercase">Extracted Document Income:</span>
                        <span className="font-extrabold text-amber-900 text-sm">
                          {activeDoc.ocrExtracted?.annualIncome || '₹2,40,000 / yr'}
                        </span>
                      </div>

                      <div className="p-3 rounded bg-amber-50 border border-amber-300 space-y-1 text-amber-900">
                        <span className="font-bold text-[11px] block">Human Oversight Advisory:</span>
                        <p className="text-[11px]">
                          Verification engine provides advisory guidance only. Decision to approve, request deficiency, or reject remains fully with the human scrutinizing officer.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Select a document on the left to inspect.</p>
                  )}
                </div>
              </div>

              {/* Action Buttons for Human Verifier */}
              <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-end gap-3 text-xs">
                <button
                  onClick={() => handleAction('RAISE_DEFICIENCY')}
                  className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  <AlertCircle className="w-4 h-4" /> Issue Deficiency Notice
                </button>
                <button
                  onClick={() => handleAction('REJECT')}
                  className="px-4 py-2 rounded bg-rose-700 hover:bg-rose-800 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  <X className="w-4 h-4" /> Reject Application
                </button>
                <button
                  onClick={() => handleAction('APPROVE')}
                  className="px-4 py-2 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Forward Application
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deficiency Modal */}
        {isDeficiencyModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="govt-card bg-white max-w-lg w-full p-6 space-y-4 shadow-2xl border-2 border-amber-500 text-xs">
              <h3 className="text-base font-extrabold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Issue Official Deficiency Notice
              </h3>
              <p className="text-slate-600 font-medium">
                The applicant will receive an in-app and email notice specifying the required document correction.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Deficiency Reason Category</label>
                  <input
                    type="text"
                    value={deficiencyReason}
                    onChange={(e) => setDeficiencyReason(e.target.value)}
                    className="w-full p-2 rounded bg-slate-50 border border-slate-300 font-medium text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Specific Officer Remarks for Applicant</label>
                  <textarea
                    rows={3}
                    value={deficiencyRemarks}
                    onChange={(e) => setDeficiencyRemarks(e.target.value)}
                    className="w-full p-2 rounded bg-slate-50 border border-slate-300 font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsDeficiencyModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={submitDeficiency}
                  className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1 shadow"
                >
                  <Send className="w-3.5 h-3.5" /> Issue Notice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { AuditLog } from '../../../types';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { History as HistoryIcon, Search as SearchIcon, ShieldCheck, RefreshCw, Calendar as CalendarIcon } from 'lucide-react';

export default function AuditLogsPage() {
  return (
    <ProtectedRoute allowedRoles={['MINISTRY_ADMIN']}>
      <AuditLogsContent />
    </ProtectedRoute>
  );
}

function AuditLogsContent() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await api.getAuditLogs({ search: searchQuery });
      if (data?.auditLogs) {
        setLogs(data.auditLogs);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Header Banner */}
      <div className="govt-card overflow-hidden">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <HistoryIcon className="w-4 h-4 text-amber-400" />
            <span>Central Regulatory & CAG Audit Trail Stream</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search App No or Action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
                className="w-full pl-9 pr-3 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs outline-none font-medium"
              />
            </div>
            <button
              onClick={fetchLogs}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1 shrink-0 shadow border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
        <div className="tricolor-ribbon"></div>

        <div className="p-4 bg-white">
          <h1 className="text-xl font-extrabold text-[#0a2540]">System Audit Trail & Traceability Logs</h1>
          <p className="text-xs text-slate-600 font-medium">
            Permanent tamper-proof audit trail of every application submission, officer scrutiny action, deficiency notice, and manual rank override.
          </p>
        </div>
      </div>

      {/* Audit Stream Table */}
      <div className="govt-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-bold">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-600 font-bold">No audit records found.</div>
        ) : (
          <div className="divide-y divide-slate-200 text-xs">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="text-[#0f2e5a] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {log.application?.applicationNo || 'GLOBAL'}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 font-extrabold">
                      {log.action}
                    </span>
                    <span className="text-slate-600 font-medium">by {log.actor?.fullName || 'Actor'} ({log.actorRole})</span>
                  </div>

                  {log.reason && (
                    <p className="text-slate-700 text-[11px] bg-slate-50 p-2 rounded border border-slate-200 font-medium">
                      <strong className="text-[#0f2e5a]">Logged Justification:</strong> {log.reason}
                    </p>
                  )}

                  {log.previousState && (
                    <p className="text-[10px] text-slate-500 font-semibold">
                      Transition: <span className="text-slate-600">{log.previousState}</span> &rarr;{' '}
                      <span className="text-emerald-800 font-bold">{log.newState}</span>
                    </p>
                  )}
                </div>

                <div className="text-right text-[10px] text-slate-500 font-medium shrink-0">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { MeritEntry, Scheme } from '../../../types';
import {
  Award,
  Sparkles,
  RefreshCw,
  Edit,
  CheckCircle2,
  Lock,
  Search,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

import { ProtectedRoute } from '../../../components/ProtectedRoute';

export default function MeritSelectionPage() {
  return (
    <ProtectedRoute allowedRoles={['STATE_ADMIN', 'MINISTRY_ADMIN']}>
      <MeritSelectionContent />
    </ProtectedRoute>
  );
}

function MeritSelectionContent() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('');
  const [meritList, setMeritList] = useState<MeritEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Manual Override Modal State
  const [overrideEntry, setOverrideEntry] = useState<MeritEntry | null>(null);
  const [newRank, setNewRank] = useState<number>(1);
  const [overrideReason, setOverrideReason] = useState('');
  const [savingOverride, setSavingOverride] = useState(false);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const data = await api.getSchemes();
      if (data?.schemes && data.schemes.length > 0) {
        setSchemes(data.schemes);
        setSelectedSchemeId(data.schemes[0].id);
        fetchMeritList(data.schemes[0].id);
      }
    } catch (err) {
      console.error('Error fetching schemes:', err);
    }
  };

  const fetchMeritList = async (schemeId: string) => {
    try {
      setLoading(true);
      const data = await api.getMeritList(schemeId);
      if (data?.meritList) {
        setMeritList(data.meritList);
      }
    } catch (err) {
      console.error('Error fetching merit list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMerit = async () => {
    if (!selectedSchemeId) return;
    try {
      setGenerating(true);
      const res = await api.generateMeritList(selectedSchemeId);
      alert(res.message || 'Merit list generated!');
      fetchMeritList(selectedSchemeId);
    } catch (err: any) {
      alert(err.message || 'Merit calculation failed');
    } finally {
      setGenerating(false);
    }
  };

  const openOverrideModal = (entry: MeritEntry) => {
    setOverrideEntry(entry);
    setNewRank(entry.rank);
    setOverrideReason('');
  };

  const submitOverride = async () => {
    if (!overrideEntry) return;
    if (!overrideReason || overrideReason.trim().length < 10) {
      alert('Mandatory justification required (min 10 characters) for manual rank override.');
      return;
    }

    try {
      setSavingOverride(true);
      await api.overrideMeritRank(overrideEntry.id, {
        newRank: Number(newRank),
        overrideReason,
      });
      alert('Merit rank overridden with human justification logged to audit trail.');
      setOverrideEntry(null);
      fetchMeritList(selectedSchemeId);
    } catch (err: any) {
      alert(err.message || 'Override failed');
    } finally {
      setSavingOverride(false);
    }
  };

  const handlePublishSelection = async () => {
    if (!selectedSchemeId) return;
    if (!confirm('Publish & Lock final selection list? This will notify candidates and update status.')) return;

    try {
      const res = await api.publishMeritList(selectedSchemeId, 50);
      alert(res.message || 'Final selection list published!');
      fetchMeritList(selectedSchemeId);
    } catch (err: any) {
      alert(err.message || 'Publish failed');
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Header Banner */}
      <div className="govt-card overflow-hidden">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Official Merit Ranking & Selection Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateMerit}
              disabled={generating}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow"
            >
              {generating ? 'Calculating...' : 'Recalculate Merit'}
            </button>
            <button
              onClick={handlePublishSelection}
              className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow"
            >
              Publish Selection List
            </button>
          </div>
        </div>
        <div className="govt-header-accent"></div>

        <div className="p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-[#0a2540]">Ranked Merit List & Final Selection</h1>
            <p className="text-xs text-slate-600">
              AI normalizes academic marks and computes ranks. Any manual override requires mandatory human justification logged to CAG audit trail.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#0f2e5a]">Scheme:</span>
            <select
              value={selectedSchemeId}
              onChange={(e) => {
                setSelectedSchemeId(e.target.value);
                fetchMeritList(e.target.value);
              }}
              className="px-3 py-1.5 rounded bg-slate-50 border border-slate-300 font-bold text-slate-800 outline-none"
            >
              {schemes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Official Government Merit Table */}
      <div className="govt-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Calculating composite merit scores...</div>
        ) : meritList.length === 0 ? (
          <div className="p-8 text-center text-slate-600 font-bold">No merit entries calculated yet. Click Recalculate Merit above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="govt-table">
              <thead>
                <tr>
                  <th className="w-16">Rank</th>
                  <th>App No</th>
                  <th>Candidate Name</th>
                  <th>State</th>
                  <th>Marks %</th>
                  <th>Income</th>
                  <th>PVTG Bonus</th>
                  <th>Composite Score</th>
                  <th className="text-right font-bold">Human Override</th>
                </tr>
              </thead>
              <tbody>
                {meritList.map((entry) => (
                  <tr key={entry.id} className={entry.isOverridden ? 'bg-amber-50' : ''}>
                    <td className="font-extrabold text-[#0f2e5a] text-sm">#{entry.rank}</td>
                    <td className="font-bold text-blue-900">{entry.application?.applicationNo}</td>
                    <td className="font-bold text-slate-800">{entry.application?.user?.fullName}</td>
                    <td>{entry.state}</td>
                    <td className="font-semibold">{entry.formData?.aggregateMarks}%</td>
                    <td>₹{Number(entry.formData?.annualIncome || 0).toLocaleString('en-IN')}</td>
                    <td>
                      {entry.formData?.isPVTG ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                          +15% PVTG
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="font-extrabold text-emerald-800 text-sm">{entry.computedScore} / 100</td>
                    <td className="text-right">
                      {entry.isOverridden ? (
                        <span className="text-amber-900 font-bold text-[11px] block" title={entry.overrideReason}>
                          Overridden by {entry.overriddenBy?.fullName || 'Admin'}
                        </span>
                      ) : (
                        <button
                          onClick={() => openOverrideModal(entry)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#0f2e5a] text-xs font-bold border border-slate-300 ml-auto"
                        >
                          Override Rank
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Override Modal */}
      {overrideEntry && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 flex items-center justify-center p-4">
          <div className="govt-card w-full max-w-md bg-white p-6 space-y-4">
            <h3 className="text-base font-extrabold text-[#0f2e5a]">
              Mandatory Human Override Justification
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">New Assigned Rank</label>
                <input
                  type="number"
                  value={newRank}
                  onChange={(e) => setNewRank(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">
                  Official Audit Justification Reason <span className="text-rose-600">*Required</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter official reason for manual rank override..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setOverrideEntry(null)} className="px-3 py-1.5 rounded bg-slate-200 text-slate-800 text-xs font-bold">
                Cancel
              </button>
              <button onClick={submitOverride} disabled={savingOverride} className="px-4 py-1.5 rounded bg-amber-600 text-white font-bold text-xs shadow">
                Save Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

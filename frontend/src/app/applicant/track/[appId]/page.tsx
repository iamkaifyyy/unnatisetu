'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api';
import { Application } from '../../../../types';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  ArrowRight,
  ShieldCheck,
  History,
  FileText,
} from 'lucide-react';

export default function TrackApplicationPage() {
  const params = useParams();
  const appId = params.appId as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  // Deficiency Response Form
  const [responseNotes, setResponseNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [appId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getApplicationById(appId);
      if (data?.application) {
        setApplication(data.application);
      }
    } catch (err) {
      console.error('Failed to load application details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDeficiency = async (deficiencyId: string) => {
    try {
      setResolving(true);
      await api.resolveDeficiency(deficiencyId, { responseNotes });
      fetchApplicationDetails();
      setResponseNotes('');
      alert('Deficiency resolved and resubmitted for verification.');
    } catch (err: any) {
      alert(err.message || 'Failed to resolve deficiency');
    } finally {
      setResolving(false);
    }
  };

  if (loading || !application) {
    return (
      <div className="py-12 text-center text-slate-500 font-bold">
        Loading official application status...
      </div>
    );
  }

  const timelineSteps = [
    { key: 'SUBMITTED', title: 'Submitted', desc: 'Application received & queued.' },
    { key: 'UNDER_SCRUTINY', title: 'Under Scrutiny', desc: 'Verified by District Officer.' },
    { key: 'DEFICIENCY_RAISED', title: 'Deficiency Raised', desc: 'Document inconsistency flagged.' },
    { key: 'RESUBMITTED', title: 'Resubmitted', desc: 'Corrected document uploaded.' },
    { key: 'SHORTLISTED', title: 'Shortlisted', desc: 'Included in merit list.' },
    { key: 'SELECTED', title: 'Final Selected', desc: 'Award sanctioned by MoTA.' },
  ];

  const currentStepIdx = timelineSteps.findIndex((s) => s.key === application.status);
  const activeDeficiency = application.deficiencies?.find((d) => d.status === 'OPEN');

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Top Banner */}
      <div className="govt-card overflow-hidden">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="font-extrabold text-xs uppercase tracking-wider">
              Official Application Status Tracker
            </span>
          </div>
          <a
            href={api.getPdfDownloadUrl(application.id)}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1 shadow"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            Download Slip (PDF)
          </a>
        </div>
        <div className="tricolor-ribbon"></div>

        <div className="p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-[#0a2540]">
              Application No: <span className="text-[#0f2e5a]">{application.applicationNo}</span>
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Scheme: <strong>{application.scheme?.name}</strong> • OCR Confidence: <strong className="text-emerald-700">{application.aiConfidenceScore}%</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Deficiency Box */}
      {activeDeficiency && (
        <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-lg space-y-3">
          <div className="flex items-center justify-between font-extrabold text-amber-900 border-b border-amber-300 pb-2 text-xs">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> OFFICIAL DEFICIENCY NOTICE ISSUED
            </span>
            <span>Deadline: {new Date(activeDeficiency.deadline).toLocaleDateString()}</span>
          </div>

          <p className="text-xs text-amber-900 font-medium">
            <strong>Reason:</strong> {activeDeficiency.reason}
          </p>

          <div className="bg-white p-3 rounded border border-amber-300 space-y-2 text-xs">
            <label className="block font-bold text-slate-800">Re-Upload Corrected Document & Explanation</label>
            <textarea
              rows={2}
              placeholder="Enter explanation for officer..."
              value={responseNotes}
              onChange={(e) => setResponseNotes(e.target.value)}
              className="w-full p-2 rounded bg-slate-50 border border-slate-300 text-slate-800 outline-none text-xs"
            />
            <button
              onClick={() => handleResolveDeficiency(activeDeficiency.id)}
              disabled={resolving}
              className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow"
            >
              {resolving ? 'Resubmitting...' : 'Resubmit Deficiency Document'}
            </button>
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="govt-card p-6 space-y-4">
        <h2 className="text-sm font-extrabold text-[#0a2540] uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-[#0f2e5a]" />
          Application Progress Workflow Status
        </h2>

        <div className="relative border-l-2 border-slate-300 ml-3 space-y-6 pl-5 text-xs">
          {timelineSteps.map((step, idx) => {
            const isDone = currentStepIdx >= idx || (application.status === 'SELECTED' && idx <= 5);
            const isCurrent = application.status === step.key;

            return (
              <div key={step.key} className="relative">
                <span
                  className={`absolute -left-[27px] top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-[#0f2e5a] text-white ring-2 ring-blue-300'
                      : isDone
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : idx + 1}
                </span>

                <div>
                  <h3 className={`font-bold ${isCurrent ? 'text-[#0f2e5a]' : 'text-slate-800'}`}>
                    {step.title} {isCurrent && <span className="text-[10px] bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-extrabold ml-2">Active Stage</span>}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Application } from '../../../types';
import { useLanguage } from '../../../context/LanguageContext';
import {
  FileCheck,
  AlertTriangle,
  Clock,
  Download,
  ShieldCheck,
  User,
  PlusCircle,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

import ProtectedRoute from '../../../components/ProtectedRoute';

export default function ApplicantDashboard() {
  const { t } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [userData, appData] = await Promise.all([api.getMe(), api.getMyApplications()]);

      if (userData?.user) setUser(userData.user);
      if (appData?.applications) setApplications(appData.applications);
    } catch (err) {
      console.error('Error loading applicant dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">{t.pendingScrutiny}</span>;
      case 'UNDER_SCRUTINY':
        return <span className="px-2.5 py-1 rounded text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">Under Scrutiny</span>;
      case 'DEFICIENCY_RAISED':
        return <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-100 text-amber-900 border border-amber-400">{t.deficiencyIssued}</span>;
      case 'RESUBMITTED':
        return <span className="px-2.5 py-1 rounded text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">Resubmitted</span>;
      case 'SHORTLISTED':
        return <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">{t.shortlisted}</span>;
      case 'SELECTED':
        return <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-700 text-white shadow">{t.selectedAward}</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-200 text-slate-700">Draft</span>;
    }
  };

  const hasDeficiency = applications.some((a) => a.status === 'DEFICIENCY_RAISED');

  return (
    <ProtectedRoute allowedRoles={['APPLICANT']}>
      <div className="space-y-6 py-2">
        {/* Student Identity Card */}
        <div className="govt-card bg-white border-slate-300 overflow-hidden">
          <div className="govt-card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-xs uppercase tracking-wider">{t.applicantProfile}</span>
            </div>
            <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded">
              {t.kycVerified}
            </span>
          </div>
          <div className="govt-header-accent"></div>

          <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl font-extrabold text-[#0a2540]">
                Applicant: <span className="text-[#0f2e5a] font-serif">{user?.fullName || 'Amit Kumar Santhal'}</span>
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                {t.domicileState}: <strong className="text-slate-900">{user?.state || 'Jharkhand'}</strong> • {t.category}: <strong className="text-amber-700 font-bold">Scheduled Tribe ({user?.category || 'ST'})</strong> • {t.digilockerId}: <strong className="text-blue-900">{user?.digilockerId || 'DIGI-ST-10001'}</strong>
              </p>
            </div>

            <div className="w-full md:w-64 bg-slate-50 p-3.5 rounded border border-slate-300 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-600">{t.profileCompleteness}</span>
                <span className="text-emerald-700">{user?.profileComplete || 85}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded transition-all"
                  style={{ width: `${user?.profileComplete || 85}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {hasDeficiency && (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-400 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <p className="font-extrabold text-sm text-amber-900">{t.deficiencyNoticeTitle}</p>
                <p className="text-xs text-amber-800">
                  A scrutinizing officer flagged a document mismatch. Please re-upload updated document before deadline.
                </p>
              </div>
            </div>
            {applications.find((a) => a.status === 'DEFICIENCY_RAISED') && (
              <Link
                href={`/applicant/track/${applications.find((a) => a.status === 'DEFICIENCY_RAISED')?.id}`}
                className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-all shadow"
              >
                {t.resolveDeficiency}
              </Link>
            )}
          </div>
        )}

        {/* Applications Table / Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#0a2540] flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#0f2e5a]" />
              {t.submittedApps}
            </h2>
            <Link
              href="/#schemes"
              className="px-3.5 py-1.5 rounded bg-[#0f2e5a] hover:bg-[#1a365d] text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              {t.applyNewScheme}
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 font-bold">Loading applicant records...</div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="govt-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-extrabold text-xs text-[#0f2e5a] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                        APP NO: {app.applicationNo}
                      </span>
                      {getStatusBadge(app.status)}
                      <span className="text-xs text-slate-600">
                        OCR Score: <strong className="text-emerald-700">{app.aiConfidenceScore}%</strong>
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#0f2e5a]">{app.scheme?.name || 'NFST Fellowship Scheme'}</h3>
                    <p className="text-xs text-slate-700">
                      Course: <strong>{app.formData?.courseName || 'Ph.D Biotechnology'}</strong> • Institution:{' '}
                      <strong>{app.formData?.institutionName || 'IIT Delhi'}</strong>
                    </p>

                    {/* AI Plain-Language Eligibility Explanation */}
                    {app.eligibilityExplanation && (
                      <div className="mt-2.5 p-3 rounded-md bg-gradient-to-r from-blue-50/90 to-amber-50/90 border border-blue-200 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#0f2e5a] text-[11px] uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>AI Eligibility Explanation (Plain Language)</span>
                        </div>
                        <p className="text-slate-800 font-medium leading-relaxed">
                          {app.eligibilityExplanation.englishExplanation}
                        </p>
                        {app.eligibilityExplanation.hindiExplanation && (
                          <p className="text-slate-700 font-serif text-[11px] border-t border-blue-100 pt-1 mt-1">
                            {app.eligibilityExplanation.hindiExplanation}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500 pt-1">
                      Submitted Date: {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Draft'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <a
                      href={api.getPdfDownloadUrl(app.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 text-[#0f2e5a] font-bold text-xs border border-slate-300 flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {t.downloadSlip}
                    </a>

                    <Link
                      href={`/applicant/track/${app.id}`}
                      className="px-4 py-2 rounded bg-[#0f2e5a] hover:bg-[#1a365d] text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      {t.trackStatus}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import { Scheme } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  Sliders,
  FileCheck,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Clock,
  ExternalLink,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const data = await api.getSchemes();
      if (data?.schemes) {
        setSchemes(data.schemes);
      }
    } catch (err) {
      console.error('Error loading schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Official Government Hero Banner */}
      <section className="govt-card overflow-hidden bg-white border border-slate-300">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{t.motaTitle} • {t.portalName}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded border border-amber-500/30 text-[10px] font-extrabold text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff9933]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#138808]"></span>
            <span className="ml-1 uppercase tracking-wider">Govt of India Verified</span>
          </div>
        </div>
        <div className="tricolor-ribbon"></div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-r from-slate-50 via-white to-amber-50/20">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0f2e5a] text-xs font-bold shadow-sm">
              <span>🏛️ Smart India Hackathon 2026 Innovation</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a2540] leading-tight font-serif">
              {t.heroTitle}
            </h1>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium max-w-3xl">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/applicant/dashboard"
                className="px-5 py-2.5 rounded-md bg-[#0f2e5a] hover:bg-[#1a365d] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-amber-400" />
                {t.applicantLogin}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/verification"
                className="px-5 py-2.5 rounded-md bg-white hover:bg-slate-100 text-[#0f2e5a] font-bold text-xs border border-[#0f2e5a] transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#0f2e5a]" />
                {t.officerPortal}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <div className="govt-card p-4 space-y-3 bg-slate-50 border-slate-300 relative">
              <div className="absolute top-0 left-0 bottom-0 w-1.5 rounded-l bg-gradient-to-b from-[#ff9933] via-slate-300 to-[#138808]"></div>
              <div className="pl-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-extrabold text-[#0f2e5a] uppercase">Live Portal Metrics</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                    Live Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mt-3">
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{t.sanctionedPool}</p>
                    <p className="text-lg font-extrabold text-[#0f2e5a] mt-0.5">₹13.5 Cr</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{t.ocrAccuracy}</p>
                    <p className="text-lg font-extrabold text-emerald-700 mt-0.5">98.4%</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{t.totalSeats}</p>
                    <p className="text-lg font-extrabold text-amber-600 mt-0.5">870 Seats</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{t.scrutinySla}</p>
                    <p className="text-lg font-extrabold text-indigo-700 mt-0.5">3.4 Days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="tricolor-divider"></div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <a href="#schemes" className="govt-card p-4 hover:border-blue-500 transition-all flex items-center gap-3 border-l-4 border-l-[#ff9933]">
          <BookOpen className="w-6 h-6 text-[#0f2e5a] shrink-0" />
          <div>
            <p className="font-bold text-[#0f2e5a]">{t.schemeGuidelines}</p>
            <p className="text-[10px] text-slate-500">NFST / NOS Rules</p>
          </div>
        </a>
        <Link href="/applicant/dashboard" className="govt-card p-4 hover:border-blue-500 transition-all flex items-center gap-3 border-l-4 border-l-slate-400">
          <FileSpreadsheet className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold text-[#0f2e5a]">{t.checkStatus}</p>
            <p className="text-[10px] text-slate-500">Track Application No</p>
          </div>
        </Link>
        <Link href="/admin/verification" className="govt-card p-4 hover:border-blue-500 transition-all flex items-center gap-3 border-l-4 border-l-[#138808]">
          <Building2 className="w-6 h-6 text-emerald-700 shrink-0" />
          <div>
            <p className="font-bold text-[#0f2e5a]">{t.nodalOfficers}</p>
            <p className="text-[10px] text-slate-500">State & District Contacts</p>
          </div>
        </Link>
        <div className="govt-card p-4 flex items-center gap-3 border-l-4 border-l-[#0f2e5a]">
          <HelpCircle className="w-6 h-6 text-indigo-700 shrink-0" />
          <div>
            <p className="font-bold text-[#0f2e5a]">{t.helpline}</p>
            <p className="text-[10px] text-slate-500">Toll Free: 1800-11-0001</p>
          </div>
        </div>
      </div>

      {/* Unified Single-Window Innovation Highlight */}
      <section className="govt-card p-6 bg-gradient-to-r from-[#0f2e5a] to-[#1a365d] text-white space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-amber-300">
              Why UnnatiSetu? Eliminating Portal Fragmentation
            </h2>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-3 py-1 rounded border border-amber-400/30">
            One-Nation One-Tribal-Portal Initiative
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Legacy Fragmented Problem */}
          <div className="bg-slate-900/60 p-4 rounded border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>The Problem: Legacy Fragmented Portals</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Previously, ST students had to navigate 5 separate portals (<code className="text-rose-300">tribal.nic.in</code>, <code className="text-rose-300">dbttribal.gov.in</code>, NSP 2.0, State portals, and Overseas portal), requiring multiple logins, re-uploading documents, and facing high rejection rates due to formatting errors.
            </p>
          </div>

          {/* UnnatiSetu Unified Solution */}
          <div className="bg-slate-900/60 p-4 rounded border border-emerald-500/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>The Solution: UnnatiSetu Single Window</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              UnnatiSetu unifies <strong>all 5 MoTA Schemes</strong> (Pre-Matric, Post-Matric, Top Class, NFST, NOS) into <strong>ONE single window</strong>. One DigiLocker login auto-evaluates eligibility across all schemes, eliminates duplicate applications, and speeds up scrutiny from months to 7 days.
            </p>
          </div>
        </div>
      </section>

      <section id="schemes" className="space-y-4">
        <div className="govt-card-header flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider">{t.activeSchemes}</h2>
          </div>
          <span className="text-xs text-amber-300 font-bold">{schemes.length} Active Schemes</span>
        </div>
        <div className="tricolor-ribbon"></div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 font-bold">Loading scheme directory...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((scheme) => (
              <div key={scheme.id} className="govt-card p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#0f2e5a] text-white">
                        CODE: {scheme.code}
                      </span>
                      <h3 className="text-base font-extrabold text-[#0f2e5a] mt-1">{scheme.name}</h3>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300 shrink-0">
                      Open For AY 2026
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {scheme.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-4">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Closing Date: <strong>{new Date(scheme.applicationWindowEnd).toLocaleDateString()}</strong>
                  </span>
                  <Link
                    href={`/applicant/apply/${scheme.id}`}
                    className="px-4 py-2 rounded bg-[#0f2e5a] hover:bg-[#1a365d] text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow"
                  >
                    {t.applyOnline}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

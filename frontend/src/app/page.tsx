'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, setCurrentUserRole } from '../lib/api';
import { Scheme } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  FileCheck,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Download,
  Search,
  Globe2,
  Lock,
  UserPlus,
  LogIn,
  X,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';
import { AshokaEmblemLogo } from '../components/Logos';

export default function HomePage() {
  const router = Router();
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Login / Signup Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [targetSchemeId, setTargetSchemeId] = useState<string | null>(null);

  // Form Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Jharkhand');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    fetchSchemes();
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('mota_token');
      if (token) {
        const data = await api.getMe();
        if (data?.user) {
          setCurrentUser(data.user);
        }
      }
    } catch (e) {
      setCurrentUser(null);
    }
  };

  const fetchSchemes = async () => {
    try {
      const data = await api.getSchemes();
      if (data?.schemes && data.schemes.length > 0) {
        setSchemes(data.schemes);
      } else {
        setSchemes(defaultOfficialDataset);
      }
    } catch (err) {
      console.error('Error loading schemes, using official dataset fallback:', err);
      setSchemes(defaultOfficialDataset);
    } finally {
      setLoading(false);
    }
  };

  // Official 5 Schemes Dataset from dbttribal.gov.in/AllScheme.aspx & tribal.nic.in/ScholarshiP.aspx
  const defaultOfficialDataset: Scheme[] = [
    {
      id: 'scheme_bvobc',
      code: 'BVOBC',
      name: 'Post-Matric Scholarship Scheme For ST Students',
      description: 'Centrally Sponsored Scheme implemented through States/UTs to provide financial assistance to ST students pursuing post-matriculation courses (Class XI, XII, UG, PG, Ph.D, Diploma). Benefit Type: In Cash.',
      portalType: 'SCHOLARSHIP',
      applicationWindowStart: '2026-01-01',
      applicationWindowEnd: '2026-12-31',
      isActive: true,
      budgetAllocation: 250000000,
      budgetUtilized: 110000000,
      totalSeats: 25000,
    },
    {
      id: 'scheme_bpvgk',
      code: 'BPVGK',
      name: 'Pre-Matric Scholarship Scheme For ST Student',
      description: 'Centrally Sponsored Scheme implemented through States/UTs for ST students studying in Classes IX and X to minimize dropout rates and foster secondary education. Benefit Type: In Cash.',
      portalType: 'SCHOLARSHIP',
      applicationWindowStart: '2026-01-01',
      applicationWindowEnd: '2026-12-31',
      isActive: true,
      budgetAllocation: 120000000,
      budgetUtilized: 45000000,
      totalSeats: 15000,
    },
    {
      id: 'scheme_a023b',
      code: 'A023B',
      name: 'Top Class Education For ST Students',
      description: 'Central Sector Scheme providing full financial assistance to meritorious ST students pursuing higher education in 265 notified Premier Institutes (IITs, IIMs, NITs, AIIMS, NIFTs, NLUs). Benefit Type: In Cash.',
      portalType: 'SCHOLARSHIP',
      applicationWindowStart: '2026-01-10',
      applicationWindowEnd: '2026-11-30',
      isActive: true,
      budgetAllocation: 60000000,
      budgetUtilized: 25000000,
      totalSeats: 1000,
    },
    {
      id: 'scheme_arg45',
      code: 'ARG45',
      name: 'National Fellowship for ST Students',
      description: 'Central Sector Scheme providing fellowship to Scheduled Tribe students for pursuing M.Phil and Ph.D. degrees in Indian Universities approved by UGC / AICTE. Benefit Type: In Cash.',
      portalType: 'FELLOWSHIP',
      applicationWindowStart: '2026-01-01',
      applicationWindowEnd: '2026-12-31',
      isActive: true,
      budgetAllocation: 55000000,
      budgetUtilized: 21000000,
      totalSeats: 750,
    },
    {
      id: 'scheme_azkmi',
      code: 'AZKMI',
      name: 'National Overseas Scholarship Scheme',
      description: 'Central Sector Scheme providing financial support for selected ST students pursuing Master Degree, Ph.D, and Post-Doctoral research in top 500 foreign universities abroad. Benefit Type: In Others.',
      portalType: 'SCHOLARSHIP',
      applicationWindowStart: '2026-01-15',
      applicationWindowEnd: '2026-11-30',
      isActive: true,
      budgetAllocation: 80000000,
      budgetUtilized: 34000000,
      totalSeats: 90,
    },
  ];

  const filteredSchemes = (schemes.length > 0 ? schemes : defaultOfficialDataset).filter(
    (s) =>
      (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.code || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyClick = (schemeId: string) => {
    setTargetSchemeId(schemeId);
    if (currentUser && currentUser.role === 'APPLICANT') {
      router.push(`/applicant/apply/${schemeId}`);
    } else {
      setAuthError('');
      setIsAuthModalOpen(true);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setAuthLoading(true);
      const data = await api.seedLogin('APPLICANT');
      if (data?.user) {
        setCurrentUser(data.user);
        setCurrentUserRole(data.user.role);
        setIsAuthModalOpen(false);
        if (targetSchemeId) {
          router.push(`/applicant/apply/${targetSchemeId}`);
        } else {
          router.push('/applicant/dashboard');
        }
      }
    } catch (err: any) {
      setAuthError('Demo login failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'LOGIN') {
        const data = await api.login({ email, password });
        if (data?.user && data?.token) {
          setCurrentUser(data.user);
          setCurrentUserRole(data.user.role);
          setIsAuthModalOpen(false);
          if (targetSchemeId) {
            router.push(`/applicant/apply/${targetSchemeId}`);
          } else {
            router.push('/applicant/dashboard');
          }
        }
      } else {
        const data = await api.register({
          email,
          password,
          fullName,
          role: 'APPLICANT',
          state,
          phone,
          aadhaarNumber,
        });
        if (data?.user && data?.token) {
          setCurrentUser(data.user);
          setCurrentUserRole(data.user.role);
          setIsAuthModalOpen(false);
          if (targetSchemeId) {
            router.push(`/applicant/apply/${targetSchemeId}`);
          } else {
            router.push('/applicant/dashboard');
          }
        }
      }
    } catch (err: any) {
      setAuthError(err?.response?.data?.error || err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* 1. Official Government Header & Hero Banner with Tricolor Theme */}
      <section className="govt-card overflow-hidden bg-white border border-slate-300 shadow-md">
        <div className="bg-[#0b1d3a] text-slate-200 px-5 py-2.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#ff9933]"></span>
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-white font-extrabold">MINISTRY OF TRIBAL AFFAIRS • GOVERNMENT OF INDIA</span>
          </div>
          <span className="text-[10px] bg-gradient-to-r from-[#ea580c] via-amber-500 to-[#ea580c] text-white font-black px-3 py-0.5 rounded shadow-sm uppercase tracking-wider">
            DBT TRIBAL PORTAL (dbttribal.gov.in)
          </span>
        </div>

        <div className="tricolor-ribbon"></div>

        <div className="p-6 sm:p-10 bg-gradient-to-br from-[#0b1d3a] via-[#0f2e5a] to-[#1e3a8a] text-white relative">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <AshokaEmblemLogo className="w-10 h-14 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Direct Benefit Transfer (DBT) Portal • tribal.nic.in
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug font-serif">
                  Scholarship & Fellowship Schemes Directory
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Official single-window portal of the Ministry of Tribal Affairs empowering over 30 lakh Scheduled Tribe (ST) students across India with direct financial support under 5 flagship national schemes.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => handleApplyClick('scheme_bvobc')}
                className="px-6 py-2.5 rounded bg-gradient-to-r from-[#ea580c] via-amber-500 to-[#ea580c] hover:brightness-110 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 border border-amber-300"
              >
                <FileCheck className="w-4 h-4 text-white" />
                Apply for ST Scholarship
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setAuthMode('LOGIN');
                  setIsAuthModalOpen(true);
                }}
                className="px-6 py-2.5 rounded bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/30 backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                Applicant Login / Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Live Metrics Counter with Tricolor Borders */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-gradient-to-r from-orange-50/50 via-white to-emerald-50/50 border-t border-slate-300 text-xs">
          <div className="p-3 bg-white rounded border border-orange-200 border-l-4 border-l-[#ea580c] shadow-sm">
            <span className="text-slate-500 font-bold text-[10px] uppercase block">Official Schemes Enrolled</span>
            <span className="text-lg font-black text-[#ea580c]">5 Flagship Schemes</span>
          </div>
          <div className="p-3 bg-white rounded border border-amber-200 border-l-4 border-l-amber-500 shadow-sm">
            <span className="text-slate-500 font-bold text-[10px] uppercase block">Annual Beneficiary Reach</span>
            <span className="text-lg font-black text-amber-700">30+ Lakh Students</span>
          </div>
          <div className="p-3 bg-white rounded border border-emerald-200 border-l-4 border-l-[#16a34a] shadow-sm">
            <span className="text-slate-500 font-bold text-[10px] uppercase block">Fund Mode</span>
            <span className="text-lg font-black text-[#16a34a]">DBT (Aadhaar Bridge)</span>
          </div>
          <div className="p-3 bg-white rounded border border-indigo-200 border-l-4 border-l-[#0f2e5a] shadow-sm">
            <span className="text-slate-500 font-bold text-[10px] uppercase block">Monitoring Agency</span>
            <span className="text-lg font-black text-[#0f2e5a]">MoTA & NIC</span>
          </div>
        </div>
      </section>

      {/* 2. Official 5 Schemes Dataset Section (dbttribal.gov.in & tribal.nic.in) */}
      <section id="schemes" className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#ea580c] pb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]"></span>
              <span className="text-xs font-black text-[#ea580c] uppercase tracking-wider">OFFICIAL NATIONAL SCHEMES</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#0f2e5a] font-serif">
              Ministry of Tribal Affairs Schemes Directory ({filteredSchemes.length})
            </h2>
            <p className="text-xs text-slate-500">Directly integrated from dbttribal.gov.in/AllScheme.aspx & tribal.nic.in/ScholarshiP.aspx</p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search scheme name or code (e.g. BVOBC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#0f2e5a]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center bg-white rounded border border-slate-300 text-xs font-semibold text-slate-500 animate-pulse">
            Loading official schemes dataset...
          </div>
        ) : filteredSchemes.length === 0 ? (
          <div className="p-8 text-center bg-white rounded border border-slate-300 text-xs text-slate-500">
            No schemes found matching "{searchQuery}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchemes.map((scheme, index) => {
              const schemeType = (scheme as any).schemeType || (scheme.portalType === 'FELLOWSHIP' ? 'Central Sector Scheme' : scheme.code === 'BPVGK' || scheme.code === 'BVOBC' ? 'Centrally Sponsored Scheme' : 'Central Sector Scheme');
              const benefitType = (scheme as any).benefitType || (scheme.code === 'AZKMI' ? 'In Others' : 'In Cash');

              return (
                <div key={scheme.id || index} className="govt-card p-5 bg-white border border-slate-300 space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                            Scheme Code: {scheme.code}
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Sl No. {index + 1}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-[#0f2e5a] mt-2 font-serif leading-snug">
                          {scheme.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 shrink-0">
                        Active Scheme
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {scheme.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded border border-slate-200">
                      <div>
                        <span className="text-slate-500 font-bold block text-[10px] uppercase">Scheme Type</span>
                        <span className="font-extrabold text-[#0f2e5a]">{schemeType}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold block text-[10px] uppercase">Benefit Type</span>
                        <span className="font-extrabold text-amber-800">{benefitType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs font-bold mt-2">
                    <button
                      onClick={() => handleApplyClick(scheme.id)}
                      className="px-4 py-2 rounded bg-[#0f2e5a] hover:bg-[#1e40af] text-white flex items-center gap-1.5 transition-all text-xs shadow-sm"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-amber-400" /> Apply Online
                    </button>

                    <a
                      href={`https://tribal.nic.in/ScholarshiP.aspx`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-[#0f2e5a] text-[11px] flex items-center gap-1 underline"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" /> Official Guidelines
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Applicant Authentication Modal (Login / Sign Up Option for Scholarship Applicants) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="govt-card w-full max-w-lg rounded-lg bg-white overflow-hidden shadow-2xl border-2 border-[#0f2e5a] animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="govt-card-header flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>APPLICANT AUTHENTICATION PORTAL</span>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="text-white hover:text-amber-300 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="tricolor-ribbon"></div>

            <div className="p-6 space-y-4">
              <div className="text-center space-y-1 border-b border-slate-200 pb-3">
                <span className="text-[11px] font-extrabold text-[#0f2e5a] uppercase tracking-wider">
                  Ministry of Tribal Affairs • Govt of India
                </span>
                <h3 className="text-lg font-extrabold text-[#0f2e5a]">
                  {authMode === 'LOGIN' ? 'ST Applicant Login' : 'New ST Student Registration'}
                </h3>
                <p className="text-xs text-slate-500">
                  {authMode === 'LOGIN'
                    ? 'Log in with your email & password to apply for scholarship'
                    : 'Register as a new ST student applicant to proceed'}
                </p>
              </div>

              {/* Sub-Tabs: Login vs Sign Up */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode('LOGIN')}
                  className={`py-2 rounded transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'LOGIN' ? 'bg-[#0f2e5a] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <LogIn className="w-4 h-4" /> Log In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('SIGNUP')}
                  className={`py-2 rounded transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'SIGNUP' ? 'bg-[#0f2e5a] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <UserPlus className="w-4 h-4" /> Sign Up
                </button>
              </div>

              {/* Error Message Display */}
              {authError && (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Quick One-Click Demo Login Button for Testing */}
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={authLoading}
                className="w-full py-2 px-3 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>One-Click Demo ST Applicant Login</span>
              </button>

              <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold my-2">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span>OR ENTER DETAILS</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
                {authMode === 'SIGNUP' && (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Full Name (As per Aadhaar/Certificate)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Hansda"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="govt-input"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="govt-input"
                  />
                </div>

                {authMode === 'SIGNUP' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="govt-input"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">State of Domicile</label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="govt-input"
                      >
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Assam">Assam</option>
                      </select>
                    </div>
                  </div>
                )}

                {authMode === 'SIGNUP' && (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Aadhaar Number (12 Digits)</label>
                    <input
                      type="text"
                      required
                      maxLength={12}
                      placeholder="123456789012"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      className="govt-input font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="govt-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded bg-[#0f2e5a] hover:bg-[#1e40af] text-white font-extrabold text-xs transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    'Processing Authentication...'
                  ) : authMode === 'LOGIN' ? (
                    <>
                      <LogIn className="w-4 h-4 text-amber-400" /> Log In & Continue to Application
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 text-amber-400" /> Create Account & Apply
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple client-side router helper fallback
function Router() {
  const router = useRouter();
  return router;
}

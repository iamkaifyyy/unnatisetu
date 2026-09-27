'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api, setAuthToken, setCurrentUserRole } from '../lib/api';
import { LANGUAGES, LanguageOption } from '../lib/languages';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  FileCheck,
  Award,
  BarChart3,
  Sliders,
  History,
  Bell,
  Sparkles,
  ChevronDown,
  Globe,
  X,
  Volume2,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { selectedLang, setLanguage, t } = useLanguage();

  const [currentRole, setCurrentRole] = useState<string>('APPLICANT');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [loadingRole, setLoadingRole] = useState(false);
  const [langTab, setLangTab] = useState<'TRIBAL' | 'OFFICIAL'>('TRIBAL');
  const [speakingText, setSpeakingText] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('mota_token');
    const role = localStorage.getItem('mota_role') || 'APPLICANT';
    setCurrentRole(role);

    if (!token) {
      switchRole('APPLICANT');
    } else {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const data = await api.getMe();
      if (data?.user) {
        setCurrentUser(data.user);
        setCurrentRole(data.user.role);
        setCurrentUserRole(data.user.role);
      }
    } catch (e) {
      switchRole('APPLICANT');
    }
  };

  const switchRole = async (role: 'APPLICANT' | 'VERIFIER' | 'STATE_ADMIN' | 'MINISTRY_ADMIN') => {
    try {
      setLoadingRole(true);
      const data = await api.seedLogin(role);
      if (data?.user) {
        setCurrentUser(data.user);
        setCurrentRole(data.user.role);
        setCurrentUserRole(data.user.role);
      }
    } catch (err) {
      console.error('Failed to switch role:', err);
    } finally {
      setLoadingRole(false);
      setIsRoleMenuOpen(false);
    }
  };

  const handleSpeechAssistant = () => {
    setSpeakingText(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Language changed to ${selectedLang.name}. ${t.portalName}`
      );
      utterance.onend = () => setSpeakingText(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setSpeakingText(false), 2000);
    }
  };

  const isApplicant = currentRole === 'APPLICANT';
  const isAdmin = currentRole === 'VERIFIER' || currentRole === 'STATE_ADMIN' || currentRole === 'MINISTRY_ADMIN';

  return (
    <header className="w-full bg-white shadow-md border-b border-slate-300">
      {/* 1. Official GoI Top Accessibility & Language Bar */}
      <div className="bg-[#0b1d3a] text-slate-200 px-4 py-1.5 text-[11px] border-b border-slate-700 flex flex-wrap items-center justify-between font-sans">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-slate-100">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            {t.govtTitle}
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300 font-medium">
            {t.motaTitle}
          </span>
        </div>

        <div className="flex items-center gap-3 font-semibold text-slate-300">
          <button
            onClick={handleSpeechAssistant}
            className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-bold transition-all ${
              speakingText
                ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t.voiceAssist}</span>
          </button>

          {/* Multi-Language Selector Dropdown Trigger */}
          <button
            onClick={() => setIsLangModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-300 text-[11px] font-extrabold shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{selectedLang.nativeName}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Official Emblem & Government Logos Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          {/* Ashoka Pillar Emblem */}
          <div className="flex flex-col items-center justify-center shrink-0 border-r border-slate-300 pr-4">
            <svg width="40" height="52" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10 C35 10 30 25 30 35 C30 50 40 60 50 60 C60 60 70 50 70 35 C70 25 65 10 50 10 Z" fill="#0f2e5a"/>
              <circle cx="50" cy="78" r="14" fill="#0f2e5a" stroke="#d97706" strokeWidth="3"/>
              <rect x="20" y="98" width="60" height="10" fill="#0f2e5a" rx="2"/>
              <text x="50" y="122" textAnchor="middle" fill="#0f2e5a" fontSize="11" fontWeight="bold" fontFamily="serif">सत्यमेव जयते</text>
            </svg>
          </div>

          <div>
            <span className="text-xs font-bold text-[#0f2e5a] tracking-wider uppercase block">जनजातीय कार्य मंत्रालय • Ministry of Tribal Affairs</span>
            <h1 className="text-lg sm:text-2xl font-extrabold text-[#0a2540] tracking-tight leading-tight font-serif">
              {t.portalName}
            </h1>
            <p className="text-[11px] text-slate-600 font-semibold">
              Government of India • Direct Benefit Transfer (DBT) Portal • <span className="text-emerald-700 font-bold">dbttribal.gov.in & tribal.nic.in</span>
            </p>
          </div>
        </div>

        {/* Government Badges & Demo Role Switcher */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 border-r border-slate-300 pr-4">
            <div className="text-center px-2 py-1 bg-amber-50 rounded border border-amber-200">
              <p className="text-[9px] font-extrabold text-amber-800 uppercase">75 Azadi Ka</p>
              <p className="text-[10px] font-bold text-[#0f2e5a]">Amrit Mahotsav</p>
            </div>
            <div className="text-center px-2 py-1 bg-blue-50 rounded border border-blue-200">
              <p className="text-[9px] font-extrabold text-blue-900 uppercase">G20 Bharat</p>
              <p className="text-[10px] font-bold text-[#0f2e5a]">Vasudhaiva Kutumbakam</p>
            </div>
          </div>

          {/* SIH Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              disabled={loadingRole}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0f2e5a] hover:bg-[#1a365d] text-white transition-all text-xs font-semibold shadow border border-slate-700"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500 text-[#0f2e5a] flex items-center justify-center font-extrabold text-[10px]">
                {currentRole.slice(0, 2)}
              </div>
              <div className="text-left">
                <p className="text-[8px] text-amber-300 font-bold uppercase tracking-wider">{t.demoRoleSwitcher}</p>
                <p className="font-bold text-white flex items-center gap-1 text-[11px]">
                  {currentRole === 'APPLICANT' && '🎓 ST Applicant'}
                  {currentRole === 'VERIFIER' && '🔍 District Verifier'}
                  {currentRole === 'STATE_ADMIN' && '🏛️ State Nodal Officer'}
                  {currentRole === 'MINISTRY_ADMIN' && '👑 Ministry Super Admin'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400 ml-0.5" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white border border-slate-300 shadow-2xl p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-200 text-[11px] font-bold text-[#0f2e5a] uppercase">
                  Select Govt Role for Demo
                </div>

                <button
                  onClick={() => switchRole('APPLICANT')}
                  className={`w-full text-left px-3 py-2 rounded transition-all flex items-center gap-3 mt-1 ${
                    currentRole === 'APPLICANT'
                      ? 'bg-blue-50 text-[#0f2e5a] font-bold border border-blue-300'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base">🎓</span>
                  <div>
                    <p className="font-bold text-[#0f2e5a]">ST Student Applicant</p>
                    <p className="text-[10px] text-slate-500">Apply, OCR Scan & Track</p>
                  </div>
                </button>

                <button
                  onClick={() => switchRole('VERIFIER')}
                  className={`w-full text-left px-3 py-2 rounded transition-all flex items-center gap-3 mt-1 ${
                    currentRole === 'VERIFIER'
                      ? 'bg-blue-50 text-[#0f2e5a] font-bold border border-blue-300'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base">🔍</span>
                  <div>
                    <p className="font-bold text-[#0f2e5a]">District Scrutiny Verifier</p>
                    <p className="text-[10px] text-slate-500">Side-by-side OCR diff & deficiency</p>
                  </div>
                </button>

                <button
                  onClick={() => switchRole('STATE_ADMIN')}
                  className={`w-full text-left px-3 py-2 rounded transition-all flex items-center gap-3 mt-1 ${
                    currentRole === 'STATE_ADMIN'
                      ? 'bg-blue-50 text-[#0f2e5a] font-bold border border-blue-300'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base">🏛️</span>
                  <div>
                    <p className="font-bold text-[#0f2e5a]">State Nodal Officer</p>
                    <p className="text-[10px] text-slate-500">State quota & scheme rules</p>
                  </div>
                </button>

                <button
                  onClick={() => switchRole('MINISTRY_ADMIN')}
                  className={`w-full text-left px-3 py-2 rounded transition-all flex items-center gap-3 mt-1 ${
                    currentRole === 'MINISTRY_ADMIN'
                      ? 'bg-blue-50 text-[#0f2e5a] font-bold border border-blue-300'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base">👑</span>
                  <div>
                    <p className="font-bold text-[#0f2e5a]">Ministry Super Admin</p>
                    <p className="text-[10px] text-slate-500">Merit overrides, analytics & audit trail</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Official Tricolor Accent Strip */}
      <div className="w-full h-1 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]"></div>

      {/* 4. Official Main Navigation Bar */}
      <div className="bg-[#0f2e5a] text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1 py-1 text-xs font-bold uppercase tracking-wider">
            {isApplicant && (
              <>
                <Link
                  href="/applicant/dashboard"
                  className={`px-4 py-2.5 rounded-md transition-colors flex items-center gap-2 ${
                    pathname.startsWith('/applicant/dashboard')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold border-b-2 border-amber-400'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  {t.applicantPortal}
                </Link>
                <Link
                  href="/#schemes"
                  className={`px-4 py-2.5 rounded-md transition-colors flex items-center gap-2 ${
                    pathname === '/' ? 'bg-[#1e40af] text-amber-300 font-extrabold' : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {t.schemeDirectory}
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  href="/admin/verification"
                  className={`px-4 py-2.5 rounded-md transition-colors flex items-center gap-2 ${
                    pathname.startsWith('/admin/verification')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold border-b-2 border-amber-400'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-sky-300" />
                  {t.verificationQueue}
                </Link>
                <Link
                  href="/admin/schemes"
                  className={`px-4 py-2.5 rounded-md transition-colors flex items-center gap-2 ${
                    pathname.startsWith('/admin/schemes')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold border-b-2 border-amber-400'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-amber-300" />
                  {t.schemeConfigEngine}
                </Link>
                <Link
                  href="/admin/merit"
                  className={`px-4 py-2.5 rounded-md transition-colors flex items-center gap-2 ${
                    pathname.startsWith('/admin/merit')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold border-b-2 border-amber-400'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  {t.meritSelection}
                </Link>
                <Link
                  href="/admin/analytics"
                  className={`px-4 py-2.5 rounded-md transition-colors flex items-center gap-2 ${
                    pathname.startsWith('/admin/analytics')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold border-b-2 border-amber-400'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  {t.analyticsReports}
                </Link>
                <Link
                  href="/admin/audit"
                  className={`px-4 py-2.5 rounded-md transition-colors flex items-center gap-2 ${
                    pathname.startsWith('/admin/audit')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold border-b-2 border-amber-400'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <History className="w-4 h-4 text-purple-300" />
                  {t.auditLogs}
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* 5. Official Announcement Ticker */}
      <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs py-1.5 px-4 flex items-center gap-3 overflow-hidden font-medium">
        <span className="bg-[#0f2e5a] text-white px-2 py-0.5 rounded font-extrabold text-[10px] uppercase tracking-wider shrink-0">
          ANNOUNCEMENT
        </span>
        <div className="whitespace-nowrap overflow-hidden">
          <div className="inline-block animate-ticker">
            <span>📢 {t.announcement}</span>
          </div>
        </div>
      </div>

      {/* 6. Multi-Language Selection Modal */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="govt-card w-full max-w-3xl rounded-lg bg-white p-6 space-y-4 max-h-[85vh] overflow-y-auto border-2 border-[#0f2e5a]">
            <div className="flex items-center justify-between border-b border-slate-300 pb-3">
              <div>
                <span className="text-xs font-bold text-[#0f2e5a] uppercase">GOVERNMENT MULTI-LINGUAL ACCESSIBILITY PORTAL</span>
                <h3 className="text-lg font-extrabold text-[#0a2540]">{t.selectLanguage}</h3>
              </div>
              <button onClick={() => setIsLangModalOpen(false)} className="p-1.5 rounded bg-slate-100 text-slate-700 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Sub-Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
              <button
                onClick={() => setLangTab('TRIBAL')}
                className={`px-4 py-2 rounded-md transition-all ${
                  langTab === 'TRIBAL' ? 'bg-[#0f2e5a] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                🌲 Prominent Tribal Languages ({LANGUAGES.filter((l) => l.category === 'TRIBAL_PROMINENT').length})
              </button>
              <button
                onClick={() => setLangTab('OFFICIAL')}
                className={`px-4 py-2 rounded-md transition-all ${
                  langTab === 'OFFICIAL' ? 'bg-[#0f2e5a] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                🇮🇳 22 Official Scheduled Languages ({LANGUAGES.filter((l) => l.category === 'OFFICIAL_22').length})
              </button>
            </div>

            {/* Language Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {LANGUAGES.filter((l) => (langTab === 'TRIBAL' ? l.category === 'TRIBAL_PROMINENT' : l.category === 'OFFICIAL_22')).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang);
                    setIsLangModalOpen(false);
                  }}
                  className={`p-3 rounded-lg text-left transition-all border ${
                    selectedLang.code === lang.code
                      ? 'bg-blue-50 border-[#0f2e5a] ring-2 ring-blue-400'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-extrabold text-[#0f2e5a] text-sm">{lang.nativeName}</p>
                  <p className="text-[11px] text-slate-600">{lang.name} {lang.script ? `• ${lang.script}` : ''}</p>
                  {lang.region && <p className="text-[10px] text-slate-500 italic mt-0.5">{lang.region}</p>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api, setAuthToken, setCurrentUserRole } from '../lib/api';
import { LANGUAGES } from '../lib/languages';
import { useLanguage } from '../context/LanguageContext';
import {
  AshokaEmblemLogo,
  AzadiKaAmritMahotsavLogo,
  G20BharatLogo,
  DigitalIndiaLogo,
} from './Logos';
import {
  ShieldCheck,
  FileCheck,
  Award,
  BarChart3,
  Sliders,
  History,
  ChevronDown,
  Globe,
  Menu,
  X,
  UserCheck,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { selectedLang, setLanguage } = useLanguage();

  const [currentRole, setCurrentRole] = useState<string>('APPLICANT');
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [loadingRole, setLoadingRole] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const isApplicant = currentRole === 'APPLICANT';
  const isAdmin = currentRole === 'VERIFIER' || currentRole === 'STATE_ADMIN' || currentRole === 'MINISTRY_ADMIN';

  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-200 font-sans relative">
      {/* 1. Indian Flag Top Accent Ribbon */}
      <div className="h-2 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#138808] shadow-inner"></div>

      {/* 2. Top Utility & Accessibility Bar */}
      <div className="bg-[#0b1d3a] text-slate-200 text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 font-medium">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ff9933]"></span>
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
          </div>
          <span className="font-extrabold text-white tracking-wide">GOVERNMENT OF INDIA</span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-300 font-semibold">MINISTRY OF TRIBAL AFFAIRS</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{selectedLang.nativeName}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded bg-white text-slate-800 shadow-xl border border-slate-200 p-1 z-50 max-h-60 overflow-y-auto">
                {LANGUAGES.slice(0, 12).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                      selectedLang.code === lang.code ? 'bg-orange-50 text-[#ea580c] font-bold' : 'hover:bg-slate-100'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              disabled={loadingRole}
              className="flex items-center gap-1.5 px-3 py-0.5 rounded bg-gradient-to-r from-[#ea580c] via-amber-500 to-[#ea580c] hover:brightness-110 text-white font-extrabold border border-amber-300 shadow-sm transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-white" />
              <span>
                {currentRole === 'APPLICANT' && 'Applicant'}
                {currentRole === 'VERIFIER' && 'Verifier'}
                {currentRole === 'STATE_ADMIN' && 'State Officer'}
                {currentRole === 'MINISTRY_ADMIN' && 'Ministry Admin'}
              </span>
              <ChevronDown className="w-3 h-3 text-white" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-1 w-56 rounded bg-white text-slate-800 shadow-xl border border-slate-200 p-1 z-50">
                <button
                  onClick={() => switchRole('APPLICANT')}
                  className="w-full text-left px-3 py-2 rounded text-xs font-semibold hover:bg-orange-50 flex items-center gap-2 text-orange-950"
                >
                  <FileCheck className="w-4 h-4 text-[#ea580c]" /> ST Applicant Role
                </button>
                <button
                  onClick={() => switchRole('VERIFIER')}
                  className="w-full text-left px-3 py-2 rounded text-xs font-semibold hover:bg-slate-100 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-sky-700" /> District Verifier Role
                </button>
                <button
                  onClick={() => switchRole('STATE_ADMIN')}
                  className="w-full text-left px-3 py-2 rounded text-xs font-semibold hover:bg-slate-100 flex items-center gap-2"
                >
                  <Sliders className="w-4 h-4 text-amber-700" /> State Nodal Officer
                </button>
                <button
                  onClick={() => switchRole('MINISTRY_ADMIN')}
                  className="w-full text-left px-3 py-2 rounded text-xs font-semibold hover:bg-emerald-50 flex items-center gap-2 text-emerald-950"
                >
                  <Award className="w-4 h-4 text-emerald-700" /> Ministry Super Admin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Government Header (Ashoka Emblem, MoTA Title, Official Campaign Logos) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Ashoka Emblem Official SVG Logo */}
          <div className="relative">
            <AshokaEmblemLogo className="w-10 h-14 shrink-0 transition-transform group-hover:scale-105" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-[#ea580c] tracking-wider uppercase block">
                जनजातीय कार्य मंत्रालय
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-extrabold text-[#0f2e5a] tracking-wider uppercase block">
                Ministry of Tribal Affairs
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0f2e5a] tracking-tight leading-tight font-serif flex items-center gap-2">
              Unnati Setu <span className="text-slate-500 font-normal text-base hidden sm:inline">• National Scholarship Portal</span>
              <span className="hidden lg:inline-flex items-center text-[10px] font-sans font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                Tiranga Certified
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold hidden md:block">
              Government of India • Direct Benefit Transfer (DBT) System • dbttribal.gov.in & tribal.nic.in
            </p>
          </div>
        </Link>

        {/* Campaign Logos Banner */}
        <div className="hidden md:flex items-center gap-3">
          <AzadiKaAmritMahotsavLogo />
          <G20BharatLogo />
          <DigitalIndiaLogo />
        </div>
      </div>

      {/* 4. Primary Navigation Bar with Tricolor Active Highlights */}
      <div className="bg-[#0f2e5a] text-white border-t-2 border-[#ff9933]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold uppercase tracking-wider py-1">
            <Link
              href="/"
              className={`px-4 py-2.5 rounded transition-all relative ${
                pathname === '/'
                  ? 'bg-[#1e40af] text-amber-300 font-extrabold shadow-inner border-b-2 border-[#ff9933]'
                  : 'text-slate-100 hover:bg-[#1a365d] hover:text-amber-200'
              }`}
            >
              Home
            </Link>


            <a
              href="/#schemes"
              className="px-4 py-2.5 rounded text-slate-100 hover:bg-[#1a365d] transition-colors"
            >
              Scholarship Directory
            </a>

            {isApplicant && (
              <Link
                href="/applicant/dashboard"
                className={`px-4 py-2.5 rounded transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith('/applicant')
                    ? 'bg-[#1e40af] text-amber-300 font-extrabold'
                    : 'text-slate-100 hover:bg-[#1a365d]'
                }`}
              >
                <FileCheck className="w-4 h-4 text-amber-400" />
                Applicant Portal
              </Link>
            )}

            {isAdmin && (
              <>
                <Link
                  href="/admin/verification"
                  className={`px-4 py-2.5 rounded transition-colors flex items-center gap-1.5 ${
                    pathname.startsWith('/admin/verification')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-sky-300" />
                  Verification Queue
                </Link>
                <Link
                  href="/admin/schemes"
                  className={`px-4 py-2.5 rounded transition-colors flex items-center gap-1.5 ${
                    pathname.startsWith('/admin/schemes')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-amber-300" />
                  Rules Engine
                </Link>
                <Link
                  href="/admin/merit"
                  className={`px-4 py-2.5 rounded transition-colors flex items-center gap-1.5 ${
                    pathname.startsWith('/admin/merit')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  Merit Selection
                </Link>
                <Link
                  href="/admin/analytics"
                  className={`px-4 py-2.5 rounded transition-colors flex items-center gap-1.5 ${
                    pathname.startsWith('/admin/analytics')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  Analytics
                </Link>
                <Link
                  href="/admin/audit"
                  className={`px-4 py-2.5 rounded transition-colors flex items-center gap-1.5 ${
                    pathname.startsWith('/admin/audit')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <History className="w-4 h-4 text-purple-300" />
                  Audit Logs
                </Link>
              </>
            )}
          </nav>

          <div className="lg:hidden py-2 flex items-center justify-between w-full">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              {currentRole === 'APPLICANT' && 'Applicant Portal'}
              {currentRole === 'VERIFIER' && 'District Verifier'}
              {currentRole === 'STATE_ADMIN' && 'State Officer'}
              {currentRole === 'MINISTRY_ADMIN' && 'Ministry Admin'}
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded bg-[#1a365d] text-amber-300 hover:bg-[#254879] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 5. Mobile Navigation Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0b1d3a] border-t border-slate-700 px-4 py-3 space-y-2 text-xs font-bold uppercase tracking-wider">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded transition-colors ${
                pathname === '/' ? 'bg-[#1e40af] text-amber-300 font-extrabold' : 'text-slate-100 hover:bg-[#1a365d]'
              }`}
            >
              Home
            </Link>

            <a
              href="/#schemes"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-slate-100 hover:bg-[#1a365d] transition-colors"
            >
              Scholarship Directory
            </a>

            {isApplicant && (
              <Link
                href="/applicant/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                  pathname.startsWith('/applicant')
                    ? 'bg-[#1e40af] text-amber-300 font-extrabold'
                    : 'text-slate-100 hover:bg-[#1a365d]'
                }`}
              >
                <FileCheck className="w-4 h-4 text-amber-400" />
                Applicant Portal
              </Link>
            )}

            {isAdmin && (
              <>
                <Link
                  href="/admin/verification"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                    pathname.startsWith('/admin/verification')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-sky-300" />
                  Verification Queue
                </Link>
                <Link
                  href="/admin/schemes"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                    pathname.startsWith('/admin/schemes')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-amber-300" />
                  Rules Engine
                </Link>
                <Link
                  href="/admin/merit"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                    pathname.startsWith('/admin/merit')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  Merit Selection
                </Link>
                <Link
                  href="/admin/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                    pathname.startsWith('/admin/analytics')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  Analytics
                </Link>
                <Link
                  href="/admin/audit"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded transition-colors flex items-center gap-2 ${
                    pathname.startsWith('/admin/audit')
                      ? 'bg-[#1e40af] text-amber-300 font-extrabold'
                      : 'text-slate-100 hover:bg-[#1a365d]'
                  }`}
                >
                  <History className="w-4 h-4 text-purple-300" />
                  Audit Logs
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

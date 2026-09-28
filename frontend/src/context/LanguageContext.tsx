'use client';

import React, { createContext, useContext, useState } from 'react';
import { LANGUAGES, LanguageOption } from '../lib/languages';

interface LanguageContextType {
  selectedLang: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  t: Record<string, string>;
}

const defaultTranslations: Record<string, string> = {
  portalName: 'National Fellowship & Scholarship Portal for ST Students',
  motaTitle: 'Ministry of Tribal Affairs',
  govtTitle: 'GOVERNMENT OF INDIA',
  applicantPortal: 'Applicant Portal',
  applicantLogin: 'Apply / Applicant Login',
  officerPortal: 'Verification Officer Login',
  sanctionedPool: 'Sanctioned Fund Pool',
  ocrAccuracy: 'AI-OCR Scrutiny Accuracy',
  totalSeats: 'Allocated Seats',
  scrutinySla: 'Avg Scrutiny SLA',
  schemeGuidelines: 'Scheme Guidelines',
  checkStatus: 'Track Application Status',
  nodalOfficers: 'Nodal Officers Contact',
  demoRoleSwitcher: 'DEMO ROLE SWITCHER',
  heroTitle: 'Unified AI-Enabled Scholarship & Direct Benefit Transfer Portal',
  heroSubtitle: 'Transforming tribal student welfare through automated OCR document scrutiny, instant merit ranking, and CAG-compliant audit trail verification.',
  announcement: 'NFST & NOS Fellowships 2026-27 Applications Open. Automated OCR document verification enabled for instant verification.',
  selectLanguage: 'Select Official / Tribal Language',
  schemeDirectory: 'Scheme Directory',
  verificationQueue: 'Verification Queue',
  schemeConfigEngine: 'Rules Engine',
  meritSelection: 'Merit Selection',
  analyticsReports: 'Analytics',
  auditLogs: 'Audit Logs',
  voiceAssist: 'Voice Assist',
};

const LanguageContext = createContext<LanguageContextType>({
  selectedLang: LANGUAGES[10] || LANGUAGES[0],
  setLanguage: () => {},
  t: defaultTranslations,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(LANGUAGES[10] || LANGUAGES[0]);

  const setLanguage = (lang: LanguageOption) => {
    setSelectedLang(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mota_selected_language', JSON.stringify(lang));
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        selectedLang,
        setLanguage,
        t: defaultTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

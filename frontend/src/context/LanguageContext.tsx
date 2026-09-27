'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, LanguageOption } from '../lib/languages';

export interface TranslationDictionary {
  // Navigation & Header
  govtTitle: string;
  motaTitle: string;
  portalName: string;
  applicantPortal: string;
  schemeDirectory: string;
  verificationQueue: string;
  schemeConfigEngine: string;
  meritSelection: string;
  analyticsReports: string;
  auditLogs: string;
  voiceAssist: string;
  selectLanguage: string;
  demoRoleSwitcher: string;
  announcement: string;

  // Common Buttons & Badges
  applyOnline: string;
  trackStatus: string;
  downloadSlip: string;
  saveDraft: string;
  nextStep: string;
  back: string;
  submit: string;
  verified: string;
  pendingScrutiny: string;
  deficiencyIssued: string;
  shortlisted: string;
  selectedAward: string;

  // Home Page
  heroTitle: string;
  heroSubtitle: string;
  applicantLogin: string;
  officerPortal: string;
  sanctionedPool: string;
  ocrAccuracy: string;
  totalSeats: string;
  scrutinySla: string;
  schemeGuidelines: string;
  checkStatus: string;
  nodalOfficers: string;
  helpline: string;
  activeSchemes: string;

  // Dashboard
  applicantProfile: string;
  kycVerified: string;
  domicileState: string;
  category: string;
  digilockerId: string;
  profileCompleteness: string;
  deficiencyNoticeTitle: string;
  resolveDeficiency: string;
  submittedApps: string;
  applyNewScheme: string;

  // Application Form Steps
  step1Title: string;
  step2Title: string;
  step3Title: string;
  step4Title: string;
  fullName: string;
  email: string;
  tribeName: string;
  gender: string;
  annualIncome: string;
  aggregateMarks: string;
  courseName: string;
  university: string;
  pvtgBelong: string;
  uploadScan: string;
  preCheckPassed: string;

  // Verification & Merit
  scrutinyQueueTitle: string;
  riskLevel: string;
  appNo: string;
  candidateName: string;
  ocrScore: string;
  action: string;
  inspectDiff: string;
  bulkApprove: string;
  recalculateMerit: string;
  publishSelection: string;
  overrideRank: string;
}

const defaultTranslations: Record<string, TranslationDictionary> = {
  en: {
    govtTitle: 'GOVERNMENT OF INDIA',
    motaTitle: 'MINISTRY OF TRIBAL AFFAIRS',
    portalName: 'Unified One-Nation Scholarship & Fellowship Portal for ST Students',
    applicantPortal: 'Applicant Portal',
    schemeDirectory: 'Unified Scheme Directory',
    verificationQueue: 'Verification Queue',
    schemeConfigEngine: 'Scheme Config Engine',
    meritSelection: 'Merit & Selection',
    analyticsReports: 'Analytics & Reports',
    auditLogs: 'Audit Trail Logs',
    voiceAssist: 'Voice Assist',
    selectLanguage: 'Select Language',
    demoRoleSwitcher: 'SIH Demo Persona Switcher',
    announcement: 'Verification of ST Fellowship & Scholarship Applications (AY 2026-27) is active • Multi-language Vernacular Assistance enabled • 7 Days SLA active.',

    applyOnline: 'Apply Online',
    trackStatus: 'Track Status',
    downloadSlip: 'Download Slip (PDF)',
    saveDraft: 'Save Draft',
    nextStep: 'Next Step',
    back: 'Back',
    submit: 'Final Application Submit',
    verified: 'Verified',
    pendingScrutiny: 'Submitted • Pending Scrutiny',
    deficiencyIssued: 'Deficiency Notice Issued',
    shortlisted: 'Shortlisted for Merit',
    selectedAward: 'Provisional Award Sanctioned',

    heroTitle: 'Unified Single-Window Tribal Scholarship & Fellowship Platform',
    heroSubtitle: 'Eliminating portal fragmentation by bringing Pre-Matric, Post-Matric, Top Class Education, NFST, and Overseas (NOS) schemes into ONE unified AI-powered platform with single-sign-on and automated cross-scheme verification.',
    applicantLogin: 'Applicant Student Login / Register',
    officerPortal: 'Officer Scrutiny Portal',
    sanctionedPool: 'Sanctioned Pool',
    ocrAccuracy: 'OCR Accuracy',
    totalSeats: 'Total Seats',
    scrutinySla: 'Scrutiny SLA',
    schemeGuidelines: 'Scheme Guidelines',
    checkStatus: 'Check Application Status',
    nodalOfficers: 'Nodal Officers List',
    helpline: 'MoTA Helpline',
    activeSchemes: 'Active MoTA Schemes Directory',

    applicantProfile: 'Aadhaar & DigiLocker Verified Profile',
    kycVerified: 'KYC Verified',
    domicileState: 'Domicile State',
    category: 'Category',
    digilockerId: 'DigiLocker ID',
    profileCompleteness: 'Profile Completeness',
    deficiencyNoticeTitle: 'Action Required: Official Deficiency Notice Issued',
    resolveDeficiency: 'Resolve Deficiency Now',
    submittedApps: 'Submitted Applications & Fellowships',
    applyNewScheme: 'Apply For New Scheme',

    step1Title: 'Step 1: Aadhaar & DigiLocker KYC Verified Data',
    step2Title: 'Step 2: Dynamic Scheme Fields',
    step3Title: 'Step 3: OCR Document Upload Scanner',
    step4Title: 'Step 4: Eligibility Pre-Check & Submission',
    fullName: 'Full Applicant Name',
    email: 'Email Address',
    tribeName: 'Scheduled Tribe / Community',
    gender: 'Gender',
    annualIncome: 'Annual Family Income (₹ INR)',
    aggregateMarks: 'PG Aggregate Marks (%)',
    courseName: 'Course & Discipline',
    university: 'University / Institution',
    pvtgBelong: 'Belongs to PVTG (+15% Bonus)',
    uploadScan: 'Upload & OCR Scan',
    preCheckPassed: '✔ Pre-Check Passed: Eligible for Scheme',

    scrutinyQueueTitle: 'Application Scrutiny & Verification Queue',
    riskLevel: 'Risk Level',
    appNo: 'Application No',
    candidateName: 'Candidate Name',
    ocrScore: 'AI OCR Score',
    action: 'Action',
    inspectDiff: 'Inspect OCR Diff',
    bulkApprove: 'Bulk Approve',
    recalculateMerit: 'Recalculate Merit',
    publishSelection: 'Publish Selection List',
    overrideRank: 'Override Rank',
  },
  hi: {
    govtTitle: 'भारत सरकार',
    motaTitle: 'जनजातीय कार्य मंत्रालय',
    portalName: 'अनुसूचित जनजाति छात्रों के लिए राष्ट्रीय फेलोशिप एवं छात्रवृत्ति पोर्टल',
    applicantPortal: 'आवेदक पोर्टल',
    schemeDirectory: 'योजना निर्देशिका',
    verificationQueue: 'सत्यापन कतार',
    schemeConfigEngine: 'योजना कॉन्फ़िगरेशन इंजन',
    meritSelection: 'योग्यता एवं चयन',
    analyticsReports: 'विश्लेषण एवं रिपोर्ट',
    auditLogs: 'ऑडिट ट्रेल लॉग',
    voiceAssist: 'वॉयस सहायता',
    selectLanguage: 'भाषा चुनें',
    demoRoleSwitcher: 'डेमो भूमिका बदलें',
    announcement: 'एसटी फेलोशिप आवेदनों (AY 2026-27) का सत्यापन सक्रिय है • बहुभाषी सहायता सक्षम • 7 दिन की एसएलए सीमा चालू है।',

    applyOnline: 'ऑनलाइन आवेदन करें',
    trackStatus: 'स्थिति देखें',
    downloadSlip: 'रसीद डाउनलोड करें (PDF)',
    saveDraft: 'ड्राफ्ट सहेजें',
    nextStep: 'अगला चरण',
    back: 'पीछे',
    submit: 'अंतिम आवेदन जमा करें',
    verified: 'सत्यापित',
    pendingScrutiny: 'जमा • जांच लंबित',
    deficiencyIssued: 'कमी का नोटिस जारी',
    shortlisted: 'योग्यता सूची हेतु चयनित',
    selectedAward: 'अनंतिम पुरस्कार स्वीकृत',

    heroTitle: 'एआई-सक्षम योजना-अग्नोस्टिक फेलोशिप प्रबंधन प्रणाली',
    heroSubtitle: 'एम.फिल, पीएच.डी और विदेशी छात्रवृत्ति (NFST और NOS) के लिए आवेदन करने वाले अनुसूचित जनजाति के छात्रों के लिए आधिकारिक पोर्टल।',
    applicantLogin: 'आवेदक छात्र लॉगिन / पंजीकरण',
    officerPortal: 'अधिकारी जांच पोर्टल',
    sanctionedPool: 'स्वीकृत बजट',
    ocrAccuracy: 'ओसीआर सटीकता',
    totalSeats: 'कुल सीटें',
    scrutinySla: 'जांच समय सीमा',
    schemeGuidelines: 'योजना दिशानिर्देश',
    checkStatus: 'आवेदन की स्थिति जांचें',
    nodalOfficers: 'नोडल अधिकारियों की सूची',
    helpline: 'जनजातीय हेल्पलाइन',
    activeSchemes: 'सक्रिय जनजातीय कार्य मंत्रालय योजनाएं',

    applicantProfile: 'आधार एवं डिजिलॉकर सत्यापित प्रोफ़ाइल',
    kycVerified: 'केवाईसी सत्यापित',
    domicileState: 'मूल राज्य',
    category: 'श्रेणी',
    digilockerId: 'डिजिलॉकर आईडी',
    profileCompleteness: 'प्रोफ़ाइल पूर्णता',
    deficiencyNoticeTitle: 'कार्रवाई आवश्यक: आधिकारिक कमी नोटिस जारी',
    resolveDeficiency: 'कमी का निवारण करें',
    submittedApps: 'जमा किए गए आवेदन एवं फेलोशिप',
    applyNewScheme: 'नई योजना के लिए आवेदन करें',

    step1Title: 'चरण 1: आधार एवं डिजिलॉकर केवाईसी डेटा',
    step2Title: 'चरण 2: योजना गतिशील फ़ील्ड',
    step3Title: 'चरण 3: ओसीआर दस्तावेज़ अपलोड स्कैनर',
    step4Title: 'चरण 4: पात्रता पूर्व-जांच एवं जमा',
    fullName: 'आवेदक का पूरा नाम',
    email: 'ईमेल पता',
    tribeName: 'अनुसूचित जनजाति / समुदाय',
    gender: 'लिंग',
    annualIncome: 'वार्षिक पारिवारिक आय (₹ INR)',
    aggregateMarks: 'पीजी कुल अंक (%)',
    courseName: 'पाठ्यक्रम एवं विषय',
    university: 'विश्वविद्यालय / संस्थान',
    pvtgBelong: 'विशेष रूप से कमजोर जनजातीय समूह (PVTG) (+15% बोनस)',
    uploadScan: 'अपलोड और ओसीआर स्कैन',
    preCheckPassed: '✔ पूर्व-जांच उत्तीर्ण: योजना के लिए पात्र',

    scrutinyQueueTitle: 'आवेदन जांच एवं सत्यापन कतार',
    riskLevel: 'जोखिम स्तर',
    appNo: 'आवेदन संख्या',
    candidateName: 'उम्मीदवार का नाम',
    ocrScore: 'एआई ओसीआर स्कोर',
    action: 'कार्रवाई',
    inspectDiff: 'ओसीआर अंतर जांचें',
    bulkApprove: 'एक साथ स्वीकृत करें',
    recalculateMerit: 'योग्यता की पुनः गणना करें',
    publishSelection: 'चयन सूची प्रकाशित करें',
    overrideRank: 'रैंक बदलें',
  },
  sat: {
    govtTitle: 'ᱵᱷᱟᱨᱚᱛ ᱥᱚᱨᱠᱟᱨ',
    motaTitle: ' tribal.gov.in • ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱢᱚᱱᱛᱨᱟᱞᱚᱭ',
    portalName: 'ᱮᱥ.ᱴᱤ. ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱯᱷᱮᱞᱳᱥᱤᱯ ᱟᱨ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱯᱳᱨᱴᱟᱞ',
    applicantPortal: 'ᱟᱵᱮᱫᱚᱱ ᱯᱳᱨᱴᱟᱞ',
    schemeDirectory: 'ᱡᱚ cross ᱰᱤᱨᱮᱠᱴᱨᱤ',
    verificationQueue: 'ᱥᱟᱹᱨᱤᱭᱟᱹᱛ ᱠᱟᱛᱟᱨ',
    schemeConfigEngine: 'ᱱᱤᱭᱚᱢ ᱵᱮᱱᱟᱣ ᱤᱧ ancestral',
    meritSelection: 'ᱢᱮᱨᱤᱴ ᱟᱨ ᱪᱚᱭᱚᱱ',
    analyticsReports: 'ᱨᱤᱯᱳᱨᱴ ᱟᱨ ᱟᱱᱟᱞᱤᱴᱤᱠᱥ',
    auditLogs: 'ᱚᱰᱤᱴ ᱞᱚᱜᱽ',
    voiceAssist: 'ᱟᱲᱟᱝ ᱥᱚᱦᱚᱫ',
    selectLanguage: 'ᱯᱟᱹᱨᱥᱤ ᱪᱚᱭᱚᱱ',
    demoRoleSwitcher: 'ᱨᱳᱞ ᱵᱚᱫᱚᱞ',
    announcement: 'ᱮᱥ.ᱴᱤ ᱯᱷᱮᱞᱳᱥᱤᱯ ᱟᱵᱮᱫᱚᱱ (AY 2026-27) ᱥᱟᱹᱨᱤᱭᱟᱹᱛ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ • ᱥᱟᱱᱛᱟᱲᱤ Ol Chiki ᱥᱚᱦᱚᱫ ᱢᱮᱱᱟᱜᱼᱟ᱾',

    applyOnline: 'ᱚᱱᱞᱟᱭᱤᱱ ᱟᱵᱮᱫᱚᱱ',
    trackStatus: 'ᱥᱛᱷᱤᱛᱤ ᱧᱮᱞ',
    downloadSlip: ' PDF ᱨᱟᱥᱤᱫ ᱰᱟᱣᱩᱱᱞᱳᱰ',
    saveDraft: 'ᱰᱨᱟᱯᱷᱴ ᱫᱚᱦᱚ',
    nextStep: 'ᱞᱟᱦᱟ ᱫᱷᱟᱯ',
    back: 'ᱛᱟᱭᱚᱢ',
    submit: 'ᱢᱩᱪᱟᱹᱫ ᱟᱵᱮᱫᱚᱱ ᱮᱢ',
    verified: 'ᱥᱟᱹᱨᱤᱭᱟᱹᱛ',
    pendingScrutiny: 'ᱟᱵᱮᱫᱚᱱ ᱮᱢ ᱟᱠᱟᱱᱟ • ᱡᱟᱸᱪ ᱵᱟᱹᱠᱤ',
    deficiencyIssued: 'ᱠᱟᱹᱢᱤ ᱚᱵᱷᱟᱣ ᱱᱳᱴᱤᱥ',
    shortlisted: 'ᱢᱮᱨᱤᱴ ᱞᱤᱥᱴ ᱨᱮ',
    selectedAward: 'ᱪᱚᱭᱚᱱ ᱟᱠᱟᱱᱟ',

    heroTitle: 'ᱮᱥ.ᱴᱤ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ AI ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱯᱳᱨᱴᱟᱞ',
    heroSubtitle: 'M.Phil, Ph.D ᱟᱨ ᱵᱤᱫᱮᱥ ᱯᱟᱲᱦᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱵᱷᱟᱨᱚᱛ ᱥᱚᱨᱠᱟᱨᱟᱜ ᱚᱯᱷᱤᱥᱤᱭᱟᱞ ᱯᱳᱨᱴᱟᱞ᱾',
    applicantLogin: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱞᱚᱜᱤᱱ',
    officerPortal: 'ᱚᱯᱷᱤᱥᱚᱨ ᱯᱳᱨᱴᱟᱞ',
    sanctionedPool: 'ᱵᱚᱡᱮᱴ ᱯᱩᱞ',
    ocrAccuracy: 'OCR ᱥᱟᱹᱨᱤᱭᱟᱹᱛ',
    totalSeats: 'ᱥᱟᱱᱟᱢ ᱥᱤᱴ',
    scrutinySla: 'SLA ᱚᱠᱛᱚ',
    schemeGuidelines: 'ᱱᱤᱭᱚᱢ ᱯᱩᱛᱷᱤ',
    checkStatus: 'ᱥᱛᱷᱤᱛᱤ ᱧᱮᱞ',
    nodalOfficers: 'ᱱᱳᱰᱟᱞ ᱚᱯᱷᱤᱥᱚᱨ ᱞᱤᱥᱴ',
    helpline: ' helpline ᱱᱚᱢᱵᱚᱨ',
    activeSchemes: 'ᱪᱟᱞᱟᱜ ᱠᱟᱱ ᱡᱚᱡᱚᱱᱟ',

    applicantProfile: 'ᱟᱫᱷᱟᱨ ᱟᱨ DigiLocker ᱥᱟᱹᱨᱤᱭᱟᱹᱛ Profile',
    kycVerified: 'KYC ᱥᱟᱹᱨᱤ',
    domicileState: 'ᱯᱚᱱᱚᱛ',
    category: ' category',
    digilockerId: 'DigiLocker ID',
    profileCompleteness: 'Profile ᱯᱩᱨᱟᱹᱣ',
    deficiencyNoticeTitle: 'ᱠᱟᱹᱢᱤ ᱞᱟᱹᱠᱛᱤ: ᱠᱟᱹᱢᱤ ᱚᱵᱷᱟᱣ ᱱᱳᱴᱤᱥ',
    resolveDeficiency: 'ᱱᱤᱛᱚᱜ ᱥᱚᱞᱦᱮᱭ cross',
    submittedApps: 'ᱮᱢ ᱟᱠᱟᱱ ᱟᱵᱮᱫᱚᱱ ᱠᱚ',
    applyNewScheme: 'ᱱᱟᱣᱟ ᱡᱚᱡᱚᱱᱟ ᱟᱵᱮᱫᱚᱱ',

    step1Title: 'ᱫᱷᱟᱯ ᱑: ᱟᱫᱷᱟᱨ ᱟᱨ DigiLocker ᱥᱟᱹᱨᱤ',
    step2Title: 'ᱫᱷᱟᱯ ᱒: ᱟᱵᱮᱫᱚᱱ ᱯᱷᱚᱨᱢ',
    step3Title: 'ᱫᱷᱟᱯ ᱓: OCR ᱠᱟᱜᱚᱡᱽ ᱥᱠᱮᱱ',
    step4Title: 'ᱫᱷᱟᱯ ᱔: ᱯᱨᱤ-ᱪᱮᱠ ᱟᱨ ᱥᱟᱵᱽᱢᱤᱴ',
    fullName: 'ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ',
    email: 'ᱤᱢᱮᱞ',
    tribeName: 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱜᱩᱴ',
    gender: 'ᱡᱟᱱᱟᱝ',
    annualIncome: 'ᱥᱮᱨᱢᱟᱠᱤᱭᱟᱹ ᱟᱨᱡᱟᱣ (₹ INR)',
    aggregateMarks: 'PG ᱢᱟᱨᱠᱥ (%)',
    courseName: 'ᱠᱳᱨᱥ ᱧᱩᱛᱩᱢ',
    university: 'ᱭᱩᱱᱤᱵᱷᱟᱨᱥᱤᱴᱤ',
    pvtgBelong: 'PVTG ᱜᱩᱴ ( +᱑᱕% ᱵᱳᱱᱟᱥ)',
    uploadScan: 'ᱠᱟᱜᱚᱡᱽ ᱥᱠᱮᱱ',
    preCheckPassed: '✔ ᱯᱟᱥ: ᱟᱵᱮᱫᱚᱱ ᱞᱟᱹᱜᱤᱫ  योग्य',

    scrutinyQueueTitle: 'ᱥᱟᱹᱨᱤᱭᱟᱹᱛ ᱠᱟᱛᱟᱨ',
    riskLevel: ' risk',
    appNo: 'ᱟᱵᱮᱫᱚᱱ ᱱᱚᱢᱵᱚᱨ',
    candidateName: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱧᱩᱛᱩᱢ',
    ocrScore: 'OCR Score',
    action: 'ᱠᱟᱹᱢᱤ',
    inspectDiff: 'OCR Difference ᱧᱮᱞ',
    bulkApprove: 'ᱥᱟᱱᱟᱢ ᱥᱟᱹᱨᱤ',
    recalculateMerit: 'Merit ᱞᱮᱠᱷᱟ',
    publishSelection: 'ᱪᱚᱭᱚᱱ ᱞᱤᱥᱴ ᱪᱷᱟᱯᱟ',
    overrideRank: 'Rank ᱵᱚᱫᱚᱞ',
  }
};

interface LanguageContextType {
  selectedLang: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  selectedLang: LANGUAGES[0],
  setLanguage: () => {},
  t: defaultTranslations['en'],
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(LANGUAGES[0]);

  useEffect(() => {
    const savedCode = localStorage.getItem('mota_lang_code');
    if (savedCode) {
      const found = LANGUAGES.find((l) => l.code === savedCode);
      if (found) setSelectedLang(found);
    }
  }, []);

  const setLanguage = (lang: LanguageOption) => {
    setSelectedLang(lang);
    localStorage.setItem('mota_lang_code', lang.code);
  };

  const currentTranslations = defaultTranslations[selectedLang.code] || defaultTranslations['en'];

  return (
    <LanguageContext.Provider value={{ selectedLang, setLanguage, t: currentTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { AshokaEmblemLogo } from '../../components/Logos';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f2e5a] hover:underline">
        <ArrowLeft className="w-4 h-4" /> Return to Main Portal
      </Link>

      <div className="govt-card overflow-hidden bg-white border border-slate-300">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>GOVERNMENT OF INDIA • PRIVACY & DATA PROTECTION POLICY</span>
          </div>
          <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded uppercase">
            DPDP Act Compliant
          </span>
        </div>
        <div className="tricolor-ribbon"></div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-4">
              <AshokaEmblemLogo className="w-10 h-14 shrink-0" />
              <div>
                <span className="text-[11px] font-extrabold text-[#0f2e5a] uppercase tracking-wider block">
                  जनजातीय कार्य मंत्रालय • Ministry of Tribal Affairs
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f2e5a]">Privacy Policy & Data Security</h1>
                <p className="text-xs text-slate-600 font-medium">
                  DPDP Act 2023 & CERT-In Compliant Data Protection Framework
                </p>
              </div>
            </div>
          </div>

          <div className="govt-notice-box-info space-y-1">
            <p className="font-extrabold text-[#0f2e5a] text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Data Fiduciary Assurance
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              The Ministry of Tribal Affairs acts as the primary Data Fiduciary for all student records. Personal data is used exclusively for verified scholarship disbursement and statutory reporting.
            </p>
          </div>

          <div className="govt-fieldset">
            <span className="govt-legend">1. Personal Information Collection & Scope</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              The Ministry collects personal data (Aadhaar Reference Hash, Applicant Name, ST Caste Certificate Details, Bank Account Details, Academic Records) strictly for processing scholarship applications, verifying eligibility, and transferring Direct Benefit Transfer (DBT) funds.
            </p>
          </div>

          <div className="govt-fieldset">
            <span className="govt-legend">2. Encryption Standards & Vault Vaulting</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              All data transmitted to and from this portal is encrypted using 256-bit SSL (TLS 1.3) encryption protocols. Sensitive fields such as Aadhaar numbers and bank account numbers are stored in hashed/encrypted vaults adhering to CERT-In security guidelines.
            </p>
          </div>

          <div className="govt-fieldset">
            <span className="govt-legend">3. Zero Commercial Sharing Mandate</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              Personal data collected on this portal is never shared with private commercial entities. Data is shared exclusively with designated Verification Officers (District/State Nodal Officers), Public Financial Management System (PFMS), NPCI, and DigiLocker for payment execution.
            </p>
          </div>

          <div className="govt-fieldset">
            <span className="govt-legend">4. Audit Trail & Log Retention</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              All system logins, document verification actions, and merit list calculations are recorded in immutable audit logs for statutory compliance and CAG audit reporting.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between font-bold">
            <span>Security Rating: CERT-In Audited Pass</span>
            <span>Ministry of Tribal Affairs • Government of India</span>
          </div>
        </div>
      </div>
    </div>
  );
}

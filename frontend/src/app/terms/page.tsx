import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileCheck, AlertTriangle } from 'lucide-react';
import { AshokaEmblemLogo } from '../../components/Logos';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f2e5a] hover:underline">
        <ArrowLeft className="w-4 h-4" /> Return to Main Portal
      </Link>

      <div className="govt-card overflow-hidden bg-white border border-slate-300">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>GOVERNMENT OF INDIA • STATUTORY TERMS & CONDITIONS</span>
          </div>
          <span className="text-[10px] bg-emerald-700 text-white font-black px-2 py-0.5 rounded uppercase">
            Official Policy
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
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f2e5a]">Terms & Conditions of Service</h1>
                <p className="text-xs text-slate-600 font-medium">
                  Direct Benefit Transfer (DBT) Scholarship Application Governance
                </p>
              </div>
            </div>
          </div>

          <div className="govt-notice-box space-y-1">
            <p className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Statutory Legal Disclosure
            </p>
            <p className="text-xs text-slate-800 leading-relaxed">
              By accessing and submitting applications on this portal, ST candidates agree to abide by all rules framed under the Ministry of Tribal Affairs guidelines and GFR 2017 provisions.
            </p>
          </div>

          <div className="govt-fieldset">
            <span className="govt-legend">1. Application Integrity & Legal Liabilities</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              Applicants submitting requests for ST scholarships (NFST, NOS, Pre/Post-Matric) must ensure that all uploaded certificates (Income Certificate, ST Caste Certificate, Academic Marksheets) are authentic. Submission of fraudulent documents will lead to immediate cancellation of scholarship, recovery of disbursed funds with interest, and criminal prosecution under Indian Penal Code / Bharatiya Nyaya Sanhita.
            </p>
          </div>

          <div className="govt-fieldset">
            <span className="govt-legend">2. Automated OCR & DigiLocker Consent</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              By registering on this portal, applicants consent to automated OCR document extraction and cross-verification of credentials against DigiLocker, Aadhaar NPCI seeding, and State Caste Certificate Repositories.
            </p>
          </div>

          <div className="govt-fieldset">
            <span className="govt-legend">3. Direct Benefit Transfer (DBT) Regulations</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              Disbursement of scholarship amounts is executed directly into the bank account linked with the applicant's Aadhaar (NPCI Aadhaar Payment Bridge). The Ministry is not responsible for transaction failures resulting from inactive or un-seeded bank accounts.
            </p>
          </div>

          <div className="govt-fieldset">
            <span className="govt-legend">4. One Scholarship Limitation</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              An applicant can avail of only one Central Government or State Government scholarship during a single academic year unless explicitly exempted under specific Ministry guidelines.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between font-bold">
            <span>Effective Date: 28 September 2026</span>
            <span>Shastri Bhawan • New Delhi</span>
          </div>
        </div>
      </div>
    </div>
  );
}

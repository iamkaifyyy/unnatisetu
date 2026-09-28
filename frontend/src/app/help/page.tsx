import Link from 'next/link';
import { ArrowLeft, ShieldCheck, HelpCircle, PhoneCall, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { AshokaEmblemLogo } from '../../components/Logos';

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f2e5a] hover:underline">
        <ArrowLeft className="w-4 h-4" /> Return to Main Portal
      </Link>

      <div className="govt-card overflow-hidden bg-white border border-slate-300">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>GOVERNMENT HELPLINE & STUDENT SUPPORT DESK</span>
          </div>
          <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded uppercase">
            Toll-Free 1800-11-0001
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
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f2e5a]">Help & Support Center</h1>
                <p className="text-xs text-slate-600 font-medium">
                  Student Assistance, Grievance Redressal & Contact Directory
                </p>
              </div>
            </div>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 space-y-2">
              <div className="w-8 h-8 rounded bg-[#0f2e5a] text-amber-400 flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-[#0f2e5a] text-xs">Toll-Free Helpline</h3>
              <p className="text-sm font-black text-amber-700">1800-11-0001</p>
              <p className="text-[10px] text-slate-500 font-medium">Mon - Sat (09:00 AM to 05:30 PM)</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 space-y-2">
              <div className="w-8 h-8 rounded bg-emerald-700 text-white flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-[#0f2e5a] text-xs">Support Desk Email</h3>
              <p className="text-xs font-bold text-[#0f2e5a]">support-tribal@gov.in</p>
              <p className="text-[10px] text-slate-500 font-medium">48 Business Hours Resolution SLA</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-300 space-y-2">
              <div className="w-8 h-8 rounded bg-purple-800 text-white flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-[#0f2e5a] text-xs">Ministry Office</h3>
              <p className="text-[11px] font-bold text-slate-700 leading-tight">
                Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001
              </p>
            </div>
          </div>

          {/* FAQ Fieldset */}
          <div className="govt-fieldset">
            <span className="govt-legend">Frequently Asked Questions (FAQs)</span>

            <div className="space-y-3 text-xs mt-3">
              <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
                <h4 className="font-extrabold text-[#0f2e5a] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  How do I apply for the National Fellowship (NFST) or Overseas Scholarship (NOS)?
                </h4>
                <p className="text-slate-600 leading-relaxed pl-6">
                  Navigate to the <strong>Applicant Portal</strong>, register with your basic details and Aadhaar number, fill in academic information, and upload your Income & ST Caste Certificates for automated OCR scanning.
                </p>
              </div>

              <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
                <h4 className="font-extrabold text-[#0f2e5a] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  What if my document OCR scan shows a discrepancy?
                </h4>
                <p className="text-slate-600 leading-relaxed pl-6">
                  If the automated OCR flags a mismatch between form details and certificate values, you will receive a deficiency notification with a 7-day window to upload a corrected certificate without losing your queue position.
                </p>
              </div>

              <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
                <h4 className="font-extrabold text-[#0f2e5a] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  How are scholarship funds disbursed?
                </h4>
                <p className="text-slate-600 leading-relaxed pl-6">
                  All scholarship disbursements are executed directly into the applicant's bank account linked with Aadhaar via the NPCI Aadhaar Payment Bridge System (DBT).
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between font-bold">
            <span>Ministry Helpline: 1800-11-0001</span>
            <span>Government of India • New Delhi</span>
          </div>
        </div>
      </div>
    </div>
  );
}

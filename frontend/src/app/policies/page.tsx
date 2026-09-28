import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { AshokaEmblemLogo, MoTALogo } from '../../components/Logos';

export default function WebsitePoliciesPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f2e5a] hover:underline">
        <ArrowLeft className="w-4 h-4" /> Return to Main Portal
      </Link>

      <div className="govt-card overflow-hidden bg-white border border-slate-300">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>GOVERNMENT OF INDIA • WEBSITE GOVERNANCE POLICIES</span>
          </div>
          <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase">
            GIGW 3.0 Compliant
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
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f2e5a]">Official Website Policies</h1>
                <p className="text-xs text-slate-600 font-medium">
                  Direct Benefit Transfer & Scholarship Management System Guidelines
                </p>
              </div>
            </div>
          </div>

          <div className="govt-notice-box-info space-y-1">
            <p className="font-extrabold text-[#0f2e5a] text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Compliance & Archival Notice
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              These website governance policies apply to all portals, sub-domains, and digital services operated under the Ministry of Tribal Affairs (tribal.nic.in, dbttribal.gov.in, fellowship.tribal.gov.in, overseas.tribal.gov.in).
            </p>
          </div>

          {/* Section 1 */}
          <div className="govt-fieldset">
            <span className="govt-legend">1. Hyperlinking Policy</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              Prior permission is not required to link directly to the information hosted on this portal. However, we require you to inform us about any links provided to this website so that you may be informed of any changes or updates therein. Pages from this site must load into a full browser window of the user.
            </p>
          </div>

          {/* Section 2 */}
          <div className="govt-fieldset">
            <span className="govt-legend">2. Content Archival Policy (CAP)</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              Content on this portal is reviewed periodically according to the Content Archival Policy. All official circulars, scheme guidelines, and merit lists remain active for public access throughout the financial year and are subsequently archived in the Tribal Digital Document Repository.
            </p>
          </div>

          {/* Section 3 */}
          <div className="govt-fieldset">
            <span className="govt-legend">3. Security Audit & STQC Certification</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              This portal is audited by STQC (Standardisation Testing and Quality Certification) Directive Standards. All applicant submissions, automated OCR verification logs, and officer approvals are logged to CAG-compliant audit trail registers.
            </p>
          </div>

          {/* Section 4 */}
          <div className="govt-fieldset">
            <span className="govt-legend">4. Accessibility Statement</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              The Ministry of Tribal Affairs is committed to ensuring that the portal is accessible to all users regardless of technology or ability. This portal is built in compliance with GIGW (Guidelines for Indian Government Websites) and WCAG 2.1 Level AA standards.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between font-bold">
            <span>Last Updated: 28 September 2026</span>
            <span>National Informatics Centre (NIC) Compliance</span>
          </div>
        </div>
      </div>
    </div>
  );
}

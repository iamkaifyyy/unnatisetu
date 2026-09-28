import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Award } from 'lucide-react';
import { AshokaEmblemLogo } from '../../components/Logos';

export default function CopyrightPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f2e5a] hover:underline">
        <ArrowLeft className="w-4 h-4" /> Return to Main Portal
      </Link>

      <div className="govt-card overflow-hidden bg-white border border-slate-300">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-400" />
            <span>GOVERNMENT INTELLECTUAL PROPERTY & COPYRIGHT</span>
          </div>
          <span className="text-[10px] bg-blue-700 text-white font-black px-2 py-0.5 rounded uppercase">
            MoTA Official
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
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f2e5a]">Copyright Policy</h1>
                <p className="text-xs text-slate-600 font-medium">
                  Official Content Usage & Reproduction Guidelines
                </p>
              </div>
            </div>
          </div>

          <div className="govt-fieldset">
            <span className="govt-legend">1. Ownership of Content</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              Material featured on this portal (including scheme guidelines, notifications, reports, circulars, and UI assets) is owned by the Ministry of Tribal Affairs, Government of India, unless otherwise specified.
            </p>
          </div>

          <div className="govt-fieldset">
            <span className="govt-legend">2. Material Reproduction Guidelines</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              The material featured on this site may be reproduced free of charge in any format or media without requiring specific permission, provided the material is reproduced accurately and not used in a derogatory manner or in a misleading context. Where the material is being published or issued to others, the source must be prominently acknowledged as <strong>"Ministry of Tribal Affairs, Government of India"</strong>.
            </p>
          </div>

          <div className="govt-fieldset">
            <span className="govt-legend">3. Emblem & Crest Usage Restrictions</span>
            <p className="text-xs text-slate-700 leading-relaxed mt-2">
              The State Emblem of India (Ashoka Lion Capital) and official Ministry of Tribal Affairs crests featured on this site cannot be reproduced, cloned, or used on third-party commercial portals without express written approval from the Ministry.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between font-bold">
            <span>Copyright © 2026 Ministry of Tribal Affairs</span>
            <span>Government of India</span>
          </div>
        </div>
      </div>
    </div>
  );
}

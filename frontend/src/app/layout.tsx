import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import { LanguageProvider } from '../context/LanguageContext';

export const metadata: Metadata = {
  title: 'National Fellowship & Scholarship Portal | Ministry of Tribal Affairs (Govt. of India)',
  description: 'Official AI-Enabled Scholarship & Fellowship Management System for Scheduled Tribe (ST) Students, Ministry of Tribal Affairs, Government of India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f4f7fb] text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
        <LanguageProvider>
          <Navbar />
          <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="bg-[#0b1d3a] text-slate-300 border-t-4 border-[#ff9933] py-8 text-xs font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-b border-slate-700 pb-6 text-slate-300">
                <div>
                  <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-2">MoTA SCHEMES</h4>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    <li>• National Fellowship for ST Students (NFST)</li>
                    <li>• National Overseas Scholarship (NOS)</li>
                    <li>• Pre-Matric & Post-Matric ST Scholarship</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-2">QUICK LINKS</h4>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    <li>• National Portal of India (india.gov.in)</li>
                    <li>• Digital India Portal</li>
                    <li>• UGC Approved University List</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-2">HELP & SUPPORT</h4>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    <li>• Toll-Free Helpline: 1800-11-0001</li>
                    <li>• Grievance Redressal Officer Email</li>
                    <li>• District Nodal Officer Contact List</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-2">SECURITY & AUDIT</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Digitally Signed & Audited Portal. All transactions are logged to tamper-proof CAG compliant audit trail logs.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
                <p>
                  Website Content Managed & Owned by <strong>Ministry of Tribal Affairs, Government of India</strong>.
                </p>
                <p className="text-slate-400 font-semibold">
                  SIH 2026 Prototype • National Informatics Centre (NIC) Compliance Mode
                </p>
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}

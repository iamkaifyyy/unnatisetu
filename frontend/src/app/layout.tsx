import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import Navbar from '../components/Navbar';
import AiAssistantWidget from '../components/AiAssistantWidget';
import { LanguageProvider } from '../context/LanguageContext';
import { NICLogo, DigitalIndiaLogo, IndiaGovLogo } from '../components/Logos';

export const metadata: Metadata = {
  title: 'Ministry of Tribal Affairs | National Scholarship Portal (Govt. of India)',
  description: 'Official Scholarship & Fellowship Management System for Scheduled Tribe (ST) Students, Ministry of Tribal Affairs, Government of India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
        <LanguageProvider>
          <Navbar />
          <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
            {children}
          </main>
          <AiAssistantWidget />

          {/* Official Indian Government Footer with Tricolor Ribbon */}
          <footer className="bg-[#0b1d3a] text-slate-300 text-xs mt-12 relative">
            <div className="tricolor-ribbon"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-300 gap-3 border-b border-slate-700/60 pb-4 font-medium">
                <div className="flex flex-wrap gap-4 font-bold">
                  <Link href="/policies" className="hover:text-amber-300 transition-colors">Website Policies</Link>
                  <Link href="/terms" className="hover:text-amber-300 transition-colors">Terms & Conditions</Link>
                  <Link href="/privacy" className="hover:text-amber-300 transition-colors">Privacy Policy</Link>
                  <Link href="/copyright" className="hover:text-amber-300 transition-colors">Copyright Policy</Link>
                  <Link href="/help" className="hover:text-amber-300 transition-colors">Help & Support</Link>
                </div>

                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700 text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
                  <span>Toll-Free National Helpline:</span>
                  <strong className="text-amber-300 font-extrabold text-xs">1800-11-0001</strong>
                </div>
              </div>

              {/* Official Logos Row & Credits */}
              <div className="flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5">
                    <span className="font-serif font-black text-amber-400">सत्यमेव जयते</span>
                    <span>• Website Content Managed & Owned by</span>
                    <strong className="text-white font-extrabold">Ministry of Tribal Affairs, Government of India</strong>.
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    Designed, Developed and Hosted by National Informatics Centre (NIC) • Ministry of Electronics & Information Technology (MeitY)
                  </p>
                </div>

                {/* Footer Official Logos */}
                <div className="flex items-center gap-3 shrink-0">
                  <IndiaGovLogo />
                  <DigitalIndiaLogo />
                  <NICLogo />
                </div>
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}

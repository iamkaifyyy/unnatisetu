import React from 'react';

// 1. Official State Emblem of India (Ashoka Lion Capital with Satyameva Jayate)
export function AshokaEmblemLogo({ className = 'w-10 h-14' }: { className?: string }) {
  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 135" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Top Lions Crown Concept */}
        <path d="M50 8 C32 8 26 24 26 36 C26 50 38 62 50 62 C62 62 74 50 74 36 C74 24 68 8 50 8 Z" fill="#0f2e5a"/>
        <path d="M50 14 C38 14 32 26 32 36 C32 46 40 54 50 54 C60 54 68 46 68 36 C68 26 62 14 50 14 Z" fill="#d97706"/>
        {/* Center Pillar Body */}
        <rect x="42" y="62" width="16" height="14" fill="#0f2e5a"/>
        {/* Ashoka Chakra Wheel */}
        <circle cx="50" cy="84" r="14" fill="#ffffff" stroke="#0f2e5a" strokeWidth="2.5"/>
        <circle cx="50" cy="84" r="3" fill="#0f2e5a"/>
        {/* Spokes */}
        {[0, 30, 60, 90, 120, 150].map((angle, i) => (
          <line
            key={i}
            x1={50 + 11 * Math.cos((angle * Math.PI) / 180)}
            y1={84 + 11 * Math.sin((angle * Math.PI) / 180)}
            x2={50 - 11 * Math.cos((angle * Math.PI) / 180)}
            y2={84 - 11 * Math.sin((angle * Math.PI) / 180)}
            stroke="#0f2e5a"
            strokeWidth="1.2"
          />
        ))}
        {/* Pedestal Platform */}
        <rect x="18" y="100" width="64" height="10" fill="#0f2e5a" rx="2"/>
        <rect x="24" y="102" width="52" height="6" fill="#d97706" rx="1"/>
        {/* Satyameva Jayate Devanagari Text */}
        <text x="50" y="125" textAnchor="middle" fill="#0f2e5a" fontSize="11" fontWeight="bold" fontFamily="serif" letterSpacing="0.5">
          सत्यमेव जयते
        </text>
      </svg>
    </div>
  );
}

// 2. Ministry of Tribal Affairs Official Emblem Badge
export function MoTALogo({ className = 'h-10' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0f2e5a] to-[#1e40af] border-2 border-amber-400 flex items-center justify-center shadow-sm shrink-0">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-amber-300" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[10px] font-black text-[#0f2e5a] tracking-wider uppercase leading-none">
          जनजातीय कार्य मंत्रालय
        </span>
        <span className="text-xs font-extrabold text-[#0f2e5a] tracking-tight leading-tight">
          Ministry of Tribal Affairs
        </span>
        <span className="text-[9px] font-bold text-emerald-700 leading-none">Government of India</span>
      </div>
    </div>
  );
}

// 3. Azadi Ka Amrit Mahotsav 75 Years Emblem Logo
export function AzadiKaAmritMahotsavLogo({ className = 'h-9' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-2.5 py-1 rounded border border-amber-300 shadow-sm ${className}`}>
      <div className="w-7 h-7 rounded-full bg-[#ff9933] text-white flex items-center justify-center font-black text-xs shadow-inner">
        75
      </div>
      <div className="text-left font-sans">
        <p className="text-[8px] font-extrabold text-amber-900 uppercase tracking-widest leading-none">Azadi Ka</p>
        <p className="text-[10px] font-black text-[#0f2e5a] uppercase leading-tight">Amrit Mahotsav</p>
      </div>
    </div>
  );
}

// 4. G20 Bharat 2023 Official Logo Badge
export function G20BharatLogo({ className = 'h-9' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-2.5 py-1 rounded border border-blue-300 shadow-sm ${className}`}>
      <div className="flex items-center font-black text-xs text-[#0f2e5a]">
        <span>G2</span>
        <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#ff9933] via-white to-[#138808] border border-blue-900 mx-0.5 inline-block"></span>
      </div>
      <div className="text-left font-sans">
        <p className="text-[8px] font-extrabold text-blue-900 uppercase tracking-wider leading-none">G20 Bharat</p>
        <p className="text-[9px] font-bold text-slate-700 leading-tight">Vasudhaiva Kutumbakam</p>
      </div>
    </div>
  );
}

// 5. Digital India Official Emblem Logo
export function DigitalIndiaLogo({ className = 'h-8' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 text-white border border-slate-700 shadow-sm ${className}`}>
      <div className="w-5 h-5 rounded bg-gradient-to-r from-[#ff9933] via-white to-[#138808] flex items-center justify-center p-0.5">
        <span className="w-full h-full bg-slate-900 rounded-[2px] flex items-center justify-center text-[10px] font-black text-amber-400">
          d
        </span>
      </div>
      <div className="text-left">
        <p className="text-[10px] font-black tracking-tight text-white uppercase leading-none">Digital India</p>
        <p className="text-[8px] font-semibold text-slate-300 leading-none">Power To Empower</p>
      </div>
    </div>
  );
}

// 6. National Informatics Centre (NIC) Logo Badge
export function NICLogo({ className = 'h-8' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0f2e5a] text-white border border-blue-900 shadow-sm ${className}`}>
      <div className="w-5 h-5 rounded bg-white text-[#0f2e5a] flex items-center justify-center font-black text-[10px] border border-amber-400">
        NIC
      </div>
      <div className="text-left">
        <p className="text-[10px] font-black text-white leading-none">National Informatics Centre</p>
        <p className="text-[8px] font-semibold text-amber-300 leading-none">Ministry of Electronics & IT</p>
      </div>
    </div>
  );
}

// 7. National Portal of India (india.gov.in) Logo Badge
export function IndiaGovLogo({ className = 'h-8' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-100 border border-slate-700 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-[#ff9933]"></span>
      <span className="w-2 h-2 rounded-full bg-white"></span>
      <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
      <span className="text-[10px] font-extrabold text-white uppercase font-sans tracking-wide">india.gov.in</span>
    </div>
  );
}

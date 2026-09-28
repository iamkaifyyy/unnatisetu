'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight, Lock, KeyRound } from 'lucide-react';
import { api } from '../lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<'APPLICANT' | 'VERIFIER' | 'STATE_ADMIN' | 'MINISTRY_ADMIN'>;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const data = await api.getMe();
      if (data?.user) {
        setUser(data.user);
        if (allowedRoles.includes(data.user.role)) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } else {
        setAuthorized(false);
      }
    } catch (e) {
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-600 font-bold bg-white rounded border border-slate-300 my-8">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-[#0f2e5a] border-t-transparent rounded-full mb-2"></div>
        <p className="text-xs uppercase tracking-wider text-[#0f2e5a]">Verifying Government Security Credentials...</p>
      </div>
    );
  }

  if (!authorized) {
    const isOfficerRoute = allowedRoles.some((r) => r !== 'APPLICANT');

    return (
      <div className="my-8 max-w-3xl mx-auto govt-card border-2 border-rose-600 overflow-hidden bg-white shadow-xl">
        <div className="bg-rose-700 text-white px-6 py-3.5 flex items-center justify-between font-sans">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
            <ShieldAlert className="w-5 h-5 text-amber-300" />
            <span>403 Access Denied • Restricted Portal Area</span>
          </div>
          <span className="bg-rose-900 text-rose-200 text-[10px] font-bold px-2.5 py-1 rounded uppercase">
            Govt Security Protocol
          </span>
        </div>
        <div className="tricolor-ribbon"></div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 border border-rose-300 font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#0a2540]">
                {isOfficerRoute ? 'Official Scrutiny Officer Credentials Required' : 'Applicant Login Required'}
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {isOfficerRoute
                  ? `Your current login role (${user?.role || 'Guest'}) does not have administrative permission to access this scrutiny workspace. Required Roles: ${allowedRoles.join(', ')}.`
                  : 'Please log in with your Aadhaar / DigiLocker verified applicant credentials to access this portal.'}
              </p>
            </div>
          </div>

          <div className="govt-notice-box text-xs space-y-1">
            <p className="font-bold text-amber-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-900" />
              <span>NIC Portal Security Notice:</span>
            </p>
            <p className="text-amber-800 text-[11px]">
              Unauthorized attempts to access restricted government officer verification queues are monitored and logged to CAG-compliant audit trail logs.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-[#0f2e5a] font-bold text-xs border border-slate-300 transition-all"
            >
              Return to Homepage
            </Link>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="px-4 py-2 rounded bg-[#0f2e5a] hover:bg-[#1a365d] text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <KeyRound className="w-4 h-4" />
              Switch Persona / Re-authenticate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;

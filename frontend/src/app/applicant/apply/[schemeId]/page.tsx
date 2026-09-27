'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { Scheme } from '../../../../types';
import {
  FileCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  FileText,
  Search,
  Eye,
  Building2,
} from 'lucide-react';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const schemeId = params.schemeId as string;

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [formData, setFormData] = useState<Record<string, any>>({
    fullName: 'Amit Kumar Santhal',
    email: 'amit.santhal@gmail.com',
    gender: 'Male',
    tribeName: 'Santhal',
    isPVTG: false,
    annualIncome: 240000,
    aggregateMarks: 78.5,
    courseName: 'Ph.D in Biotechnology',
    institutionName: 'Indian Institute of Technology (IIT) Delhi',
    isApprovedInstitution: true,
    bankAccountNo: '918273645123',
    ifscCode: 'SBIN0001234',
    passportValid: true,
  });

  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [isScanningOcr, setIsScanningOcr] = useState<boolean>(false);
  const [ocrScanResult, setOcrScanResult] = useState<any | null>(null);

  const [eligibilityEval, setEligibilityEval] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchSchemeDetails();
  }, [schemeId]);

  const fetchSchemeDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getSchemeById(schemeId);
      if (data?.scheme) {
        setScheme(data.scheme);
      }
    } catch (err) {
      console.error('Failed to load scheme:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = async () => {
    try {
      const res = await api.saveDraftApplication({
        schemeId,
        formData,
        applicationId: applicationId || undefined,
      });
      if (res?.application) {
        setApplicationId(res.application.id);
        alert('Application draft saved successfully.');
      }
    } catch (e) {
      console.error('Autosave error:', e);
    }
  };

  const handleDocumentUpload = async (docType: string, fileName: string) => {
    try {
      setIsScanningOcr(true);
      setOcrScanResult(null);

      let appId = applicationId;
      if (!appId) {
        const draftRes = await api.saveDraftApplication({ schemeId, formData });
        appId = draftRes.application.id;
        setApplicationId(appId);
      }

      const res = await api.uploadDocument({
        applicationId: appId!,
        documentType: docType,
        fileName,
      });

      if (res?.document) {
        setUploadedDocs((prev) => [...prev.filter((d) => d.type !== docType), res.document]);
        setOcrScanResult(res.document);
      }
    } catch (err) {
      console.error('Document upload scan error:', err);
    } finally {
      setIsScanningOcr(false);
    }
  };

  const evaluateEligibility = () => {
    if (!scheme?.activeConfig) return;
    const rules = scheme.activeConfig.eligibilityRules;

    let passed = 0;
    const results = rules.map((rule) => {
      const val = formData[rule.field];
      let ok = false;
      if (rule.operator === '<=') ok = Number(val) <= Number(rule.value);
      if (rule.operator === '>=') ok = Number(val) >= Number(rule.value);
      if (rule.operator === '==') ok = String(val).toLowerCase().trim() === String(rule.value).toLowerCase().trim();
      if (ok) passed++;
      return { ...rule, ok, actual: val };
    });

    setEligibilityEval({
      isEligible: passed === rules.length,
      passed,
      total: rules.length,
      results,
    });
  };

  const handleFinalSubmit = async () => {
    if (!applicationId) {
      const draftRes = await api.saveDraftApplication({ schemeId, formData });
      setApplicationId(draftRes.application.id);
    }

    try {
      setSubmitting(true);
      const res = await api.submitApplication(applicationId!);
      if (res?.application) {
        router.push(`/applicant/track/${res.application.id}`);
      }
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !scheme) {
    return (
      <div className="py-12 text-center text-slate-500 font-bold">
        Loading official scheme configuration form...
      </div>
    );
  }

  const activeConfig = scheme.activeConfig;
  const requiredDocs = activeConfig?.requiredDocuments || [];

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Top Scheme Banner */}
      <div className="govt-card overflow-hidden">
        <div className="govt-card-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span className="font-extrabold text-xs uppercase tracking-wider">
              {scheme.code} • Official Application Form (v{activeConfig?.version}.0)
            </span>
          </div>
          <button
            onClick={handleSaveDraft}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1 shadow"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            Save Draft
          </button>
        </div>
        <div className="tricolor-ribbon"></div>

        <div className="p-4 bg-white">
          <h1 className="text-lg font-extrabold text-[#0a2540]">{scheme.name}</h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">{scheme.description}</p>
        </div>
      </div>

      {/* Progress Step Bar */}
      <div className="grid grid-cols-4 gap-2 text-xs font-bold">
        {[
          { num: 1, title: '1. Identity & KYC' },
          { num: 2, title: '2. Application Fields' },
          { num: 3, title: '3. OCR Document Scan' },
          { num: 4, title: '4. Pre-Check & Submit' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => {
              if (s.num === 4) evaluateEligibility();
              setCurrentStep(s.num);
            }}
            className={`p-2.5 rounded border text-center transition-all ${
              currentStep === s.num
                ? 'bg-[#0f2e5a] text-white border-[#0f2e5a] shadow'
                : currentStep > s.num
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* STEP 1 */}
      {currentStep === 1 && (
        <div className="govt-card p-6 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-extrabold text-[#0a2540] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              Step 1: Aadhaar & DigiLocker KYC Verified Data
            </h2>
            <p className="text-xs text-slate-500">Auto-filled from verified Ministry of Tribal Affairs single applicant database.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Applicant Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Scheduled Tribe / Community</label>
              <input
                type="text"
                value={formData.tribeName}
                onChange={(e) => handleInputChange('tribeName', e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-800 outline-none font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Aadhaar & DigiLocker KYC Verified Match: XXXX-XXXX-8921
            </span>
            <span className="bg-emerald-700 text-white text-[10px] px-2 py-0.5 rounded">Verified</span>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2 rounded bg-[#0f2e5a] hover:bg-[#1a365d] text-white font-bold text-xs shadow flex items-center gap-1.5"
            >
              Next Step: Form Fields
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {currentStep === 2 && (
        <div className="govt-card p-6 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-extrabold text-[#0a2540]">Step 2: Dynamic Scheme Fields</h2>
            <p className="text-xs text-slate-500">Rendered dynamically from active Scheme Config eligibility rules.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Annual Family Income (₹ INR)</label>
              <input
                type="number"
                value={formData.annualIncome}
                onChange={(e) => handleInputChange('annualIncome', Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-800 outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Scheme Income Cap: ₹6,00,000/-</p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">PG Aggregate Marks (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.aggregateMarks}
                onChange={(e) => handleInputChange('aggregateMarks', Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-800 outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">Min Cutoff: 55.0%</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">Course & Discipline</label>
              <input
                type="text"
                value={formData.courseName}
                onChange={(e) => handleInputChange('courseName', e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-800 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">University / Institution (MoTA Approved List)</label>
              <select
                value={formData.institutionName}
                onChange={(e) => handleInputChange('institutionName', e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-300 text-slate-800 outline-none font-medium"
              >
                <option value="Indian Institute of Technology (IIT) Delhi">Indian Institute of Technology (IIT) Delhi</option>
                <option value="Central University of Jharkhand, Ranchi">Central University of Jharkhand, Ranchi</option>
                <option value="Jawaharlal Nehru University (JNU), New Delhi">Jawaharlal Nehru University (JNU), New Delhi</option>
                <option value="University of Oxford (For NOS Scheme)">University of Oxford (For NOS Scheme)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Particularly Vulnerable Tribal Group (PVTG)</label>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={formData.isPVTG}
                  onChange={(e) => handleInputChange('isPVTG', e.target.checked)}
                  className="rounded border-slate-300 text-[#0f2e5a]"
                />
                <span className="text-slate-800 font-bold">Belongs to PVTG (+15% Merit Weightage Bonus)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-2 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2 rounded bg-[#0f2e5a] hover:bg-[#1a365d] text-white font-bold text-xs shadow flex items-center gap-1.5"
            >
              Next Step: Document OCR
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {currentStep === 3 && (
        <div className="govt-card p-6 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-extrabold text-[#0a2540]">Step 3: OCR Document Upload Scanner</h2>
            <p className="text-xs text-slate-500">Tesseract OCR analyzes certificates and highlights mismatches before submission.</p>
          </div>

          <div className="space-y-4">
            {requiredDocs.map((docDef) => {
              const uploaded = uploadedDocs.find((d) => d.type === docDef.type);

              return (
                <div key={docDef.type} className="p-4 rounded border border-slate-300 bg-slate-50 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-extrabold text-sm text-[#0f2e5a]">{docDef.name}</p>
                      <p className="text-[11px] text-slate-500">Formats: PNG, JPG, PDF (Max 5MB)</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDocumentUpload(docDef.type, `${docDef.type.toLowerCase()}_sample.png`)}
                        className="px-3 py-1.5 rounded bg-[#0f2e5a] hover:bg-[#1a365d] text-white font-bold text-xs shadow flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload & OCR Scan
                      </button>

                      <button
                        onClick={() => handleDocumentUpload(docDef.type, `${docDef.type.toLowerCase()}_mismatch.png`)}
                        className="px-2.5 py-1.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300 text-[11px]"
                      >
                        Test Mismatch
                      </button>
                    </div>
                  </div>

                  {uploaded && (
                    <div className="p-3 bg-white border border-slate-300 rounded text-xs space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> OCR Analyzed: {uploaded.fileName}
                        </span>
                        <span className="text-slate-600">Confidence: <strong className="text-blue-900">{uploaded.ocrConfidenceScore}%</strong></span>
                      </div>

                      {uploaded.mismatchFlags && uploaded.mismatchFlags.length > 0 && (
                        <div className="p-2 bg-rose-50 border border-rose-300 text-rose-900 font-bold text-[11px]">
                          ⚠️ {uploaded.mismatchFlags[0].description}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-2 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => {
                evaluateEligibility();
                setCurrentStep(4);
              }}
              className="px-5 py-2 rounded bg-[#0f2e5a] hover:bg-[#1a365d] text-white font-bold text-xs shadow flex items-center gap-1.5"
            >
              Proceed to Pre-Check
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {currentStep === 4 && (
        <div className="govt-card p-6 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-extrabold text-[#0a2540]">Step 4: Eligibility Pre-Check & Submission</h2>
            <p className="text-xs text-slate-500">Rules Engine pre-evaluates form fields for compliance.</p>
          </div>

          {eligibilityEval && (
            <div className={`p-4 rounded border ${eligibilityEval.isEligible ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>
              <div className="flex items-center justify-between font-extrabold text-sm mb-2">
                <span>{eligibilityEval.isEligible ? '✔ Pre-Check Passed: Eligible for Scheme' : '⚠️ Eligibility Notice'}</span>
                <span>{eligibilityEval.passed} / {eligibilityEval.total} Norms Met</span>
              </div>
              <div className="space-y-1 text-xs">
                {eligibilityEval.results.map((r: any) => (
                  <div key={r.id} className="flex justify-between p-2 bg-white rounded border border-slate-200">
                    <span className="font-bold">{r.label}</span>
                    <span className={r.ok ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                      {r.ok ? 'Passed' : 'Failed'} ({r.actual})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow flex items-center gap-1.5"
            >
              {submitting ? 'Submitting...' : 'Final Application Submit'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

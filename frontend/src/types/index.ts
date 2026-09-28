export type Role = 'APPLICANT' | 'VERIFIER' | 'STATE_ADMIN' | 'MINISTRY_ADMIN';

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_SCRUTINY'
  | 'DEFICIENCY_RAISED'
  | 'RESUBMITTED'
  | 'SHORTLISTED'
  | 'SELECTED'
  | 'REJECTED'
  | 'WAITLISTED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  state?: string;
  district?: string;
  category?: string;
  pvtgGroup?: string;
  aadhaarNumber?: string;
  digilockerId?: string;
  profileComplete?: number;
}

export interface EligibilityRule {
  id: string;
  field: string;
  label: string;
  operator: '<=' | '>=' | '==' | '!=' | 'contains' | 'in';
  value: any;
  description: string;
}

export interface RequiredDocumentDef {
  type: string;
  name: string;
  required: boolean;
}

export interface ScoringWeightage {
  academicMarksWeight: number;
  incomeWeight: number;
  pvtgBonus: number;
  femaleBonus: number;
  maxIncomeCap: number;
}

export interface SchemeConfig {
  id: string;
  schemeId: string;
  version: number;
  isActive: boolean;
  eligibilityRules: EligibilityRule[];
  requiredDocuments: RequiredDocumentDef[];
  scoringWeightage: ScoringWeightage;
  tieBreakerRules: string[];
}

export interface Scheme {
  id: string;
  code: string;
  name: string;
  description: string;
  portalType: string;
  applicationWindowStart: string;
  applicationWindowEnd: string;
  isActive: boolean;
  budgetAllocation: number;
  budgetUtilized: number;
  totalSeats: number;
  activeConfig?: SchemeConfig;
}

export interface Document {
  id: string;
  applicationId: string;
  type: string;
  fileName: string;
  fileUrl: string;
  ocrConfidenceScore: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'FLAGGED' | 'REJECTED';
  ocrExtracted?: Record<string, any>;
  mismatchFlags?: Array<{
    field: string;
    documentValue: string;
    formValue: string;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    description: string;
  }>;
}

export interface DeficiencyNotice {
  id: string;
  applicationId: string;
  reason: string;
  remarks?: string;
  category: string;
  deadline: string;
  status: 'OPEN' | 'RESOLVED' | 'EXPIRED';
  createdAt: string;
}

export interface Application {
  id: string;
  applicationNo: string;
  userId: string;
  schemeId: string;
  schemeConfigVersion: number;
  status: ApplicationStatus;
  riskLevel: RiskLevel;
  aiConfidenceScore: number;
  formData: Record<string, any>;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  scheme?: Scheme;
  user?: User;
  documents?: Document[];
  deficiencies?: DeficiencyNotice[];
  eligibilityExplanation?: {
    englishExplanation: string;
    hindiExplanation?: string;
  };
  eligibilityEval?: {
    isEligible: boolean;
    scoreRatio: number;
    passedCount: number;
    totalRules: number;
    ruleResults: Array<{
      ruleId: string;
      field: string;
      label: string;
      expected: string;
      actual: string;
      passed: boolean;
      reason: string;
    }>;
    summary: string;
  };
}

export interface MeritEntry {
  id: string;
  applicationId: string;
  schemeId: string;
  computedScore: number;
  scoreBreakdown: {
    academicPoints: number;
    incomePoints: number;
    pvtgBonusPoints: number;
    femaleBonusPoints: number;
    total: number;
  };
  rank: number;
  category: string;
  state: string;
  isOverridden: boolean;
  overrideReason?: string;
  application?: Application;
  formData?: Record<string, any>;
  overriddenBy?: { fullName: string };
}

export interface AuditLog {
  id: string;
  applicationId: string;
  actorId: string;
  actorRole: Role;
  action: string;
  reason?: string;
  previousState?: string;
  newState?: string;
  metadata?: any;
  timestamp: string;
  application?: { applicationNo: string; scheme?: { code: string; name: string } };
  actor?: { fullName: string; email: string; role: string };
}

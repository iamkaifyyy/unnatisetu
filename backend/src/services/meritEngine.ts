export interface ScoringWeightage {
  academicMarksWeight: number; // e.g. 50%
  incomeWeight: number;        // e.g. 30% (lower income gets higher score)
  pvtgBonus: number;           // e.g. 15% bonus for Particularly Vulnerable Tribal Groups
  femaleBonus: number;         // e.g. 5% bonus for female candidates
  maxIncomeCap: number;        // e.g. 600000 INR
}

export interface MeritCalculationInput {
  applicationId: string;
  applicationNo: string;
  applicantName: string;
  state: string;
  category: string;
  academicMarks: number;    // percentage 0-100
  annualIncome: number;     // INR
  isPVTG: boolean;
  isFemale: boolean;
  submittedAt: Date;
  dob?: string;             // ISO date for age tie-breaker
}

export interface CalculatedMeritItem {
  applicationId: string;
  applicationNo: string;
  applicantName: string;
  state: string;
  category: string;
  computedScore: number;
  scoreBreakdown: {
    academicPoints: number;
    incomePoints: number;
    pvtgBonusPoints: number;
    femaleBonusPoints: number;
    total: number;
  };
  rank: number;
  isOverridden: boolean;
  overrideReason?: string;
}

export class MeritEngine {
  /**
   * Computes a normalized composite merit score (0-100) based on SchemeConfig weightage
   * and ranks all shortlisted applications accordingly.
   */
  public static calculateMeritList(
    inputs: MeritCalculationInput[],
    weightage: ScoringWeightage
  ): CalculatedMeritItem[] {
    const {
      academicMarksWeight = 50,
      incomeWeight = 30,
      pvtgBonus = 15,
      femaleBonus = 5,
      maxIncomeCap = 600000,
    } = weightage;

    const scoredItems = inputs.map((item) => {
      // 1. Academic Points (0 to academicMarksWeight)
      const normalizedMarks = Math.min(100, Math.max(0, item.academicMarks));
      const academicPoints = (normalizedMarks / 100) * academicMarksWeight;

      // 2. Income Points (Inverse scale: lower income gets maximum income weightage)
      // Income = 0 -> 100% of incomeWeight; Income = maxIncomeCap -> 0% of incomeWeight
      const clampedIncome = Math.min(maxIncomeCap, Math.max(0, item.annualIncome));
      const incomeFactor = 1 - clampedIncome / maxIncomeCap;
      const incomePoints = incomeFactor * incomeWeight;

      // 3. PVTG Bonus Points
      const pvtgBonusPoints = item.isPVTG ? pvtgBonus : 0;

      // 4. Female Candidate Bonus Points
      const femaleBonusPoints = item.isFemale ? femaleBonus : 0;

      const totalScore = Math.round((academicPoints + incomePoints + pvtgBonusPoints + femaleBonusPoints) * 100) / 100;

      return {
        ...item,
        computedScore: totalScore,
        scoreBreakdown: {
          academicPoints: Math.round(academicPoints * 100) / 100,
          incomePoints: Math.round(incomePoints * 100) / 100,
          pvtgBonusPoints,
          femaleBonusPoints,
          total: totalScore,
        },
      };
    });

    // Sort with Tie-Breaker Logic:
    // Primary: Computed Score (Descending)
    // Secondary Tie-breaker 1: Lower Family Income
    // Secondary Tie-breaker 2: Earlier Submission Timestamp
    scoredItems.sort((a, b) => {
      if (b.computedScore !== a.computedScore) {
        return b.computedScore - a.computedScore;
      }
      if (a.annualIncome !== b.annualIncome) {
        return a.annualIncome - b.annualIncome; // lower income wins tie
      }
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    });

    // Assign Ranks
    return scoredItems.map((item, index) => ({
      applicationId: item.applicationId,
      applicationNo: item.applicationNo,
      applicantName: item.applicantName,
      state: item.state,
      category: item.category,
      computedScore: item.computedScore,
      scoreBreakdown: item.scoreBreakdown,
      rank: index + 1,
      isOverridden: false,
    }));
  }
}

export interface EligibilityRule {
  id: string;
  field: string; // e.g. "annualIncome", "aggregateMarks", "age", "category", "isApprovedInstitution"
  label: string;
  operator: '<=' | '>=' | '==' | '!=' | 'contains' | 'in';
  value: any;
  description: string;
}

export interface RuleResult {
  ruleId: string;
  field: string;
  label: string;
  expected: string;
  actual: string;
  passed: boolean;
  reason: string;
}

export interface EligibilityEvaluation {
  isEligible: boolean;
  scoreRatio: number; // e.g. 4/4 rules passed -> 100%
  passedCount: number;
  totalRules: number;
  ruleResults: RuleResult[];
  summary: string;
}

export class EligibilityEngine {
  /**
   * Deterministically evaluates an application form payload against a scheme configuration rule set.
   * Completely explainable, audit-ready, no black-box predictions.
   */
  public static evaluate(
    formData: Record<string, any>,
    rules: EligibilityRule[]
  ): EligibilityEvaluation {
    if (!rules || !Array.isArray(rules) || rules.length === 0) {
      return {
        isEligible: true,
        scoreRatio: 1.0,
        passedCount: 0,
        totalRules: 0,
        ruleResults: [],
        summary: "No eligibility rules configured. Auto-passed.",
      };
    }

    const ruleResults: RuleResult[] = [];
    let passedCount = 0;

    for (const rule of rules) {
      const actualVal = formData[rule.field];
      let passed = false;
      let actualStr = actualVal !== undefined && actualVal !== null ? String(actualVal) : "Not Provided";
      let expectedStr = String(rule.value);

      switch (rule.operator) {
        case '<=': {
          const numActual = Number(actualVal);
          const numExpected = Number(rule.value);
          passed = !isNaN(numActual) && numActual <= numExpected;
          actualStr = !isNaN(numActual) ? `₹${numActual.toLocaleString('en-IN')}` : actualStr;
          expectedStr = `₹${numExpected.toLocaleString('en-IN')}`;
          break;
        }
        case '>=': {
          const numActual = Number(actualVal);
          const numExpected = Number(rule.value);
          passed = !isNaN(numActual) && numActual >= numExpected;
          break;
        }
        case '==': {
          passed = String(actualVal).toLowerCase().trim() === String(rule.value).toLowerCase().trim();
          break;
        }
        case '!=': {
          passed = String(actualVal).toLowerCase().trim() !== String(rule.value).toLowerCase().trim();
          break;
        }
        case 'contains': {
          passed = String(actualVal || '').toLowerCase().includes(String(rule.value).toLowerCase());
          break;
        }
        case 'in': {
          const list = Array.isArray(rule.value) ? rule.value : String(rule.value).split(',').map(s => s.trim().toLowerCase());
          passed = list.includes(String(actualVal || '').toLowerCase());
          break;
        }
        default:
          passed = false;
      }

      if (passed) passedCount++;

      let reason = passed
        ? `Passed: ${rule.label} requirement satisfied (${actualStr}).`
        : `Failed: ${rule.label} requirement not met. Required ${rule.operator} ${expectedStr}, found ${actualStr}.`;

      ruleResults.push({
        ruleId: rule.id,
        field: rule.field,
        label: rule.label,
        expected: `${rule.operator} ${expectedStr}`,
        actual: actualStr,
        passed,
        reason,
      });
    }

    const isEligible = passedCount === rules.length;
    const scoreRatio = passedCount / rules.length;
    const summary = isEligible
      ? `Applicant meets all ${rules.length} eligibility criteria.`
      : `Applicant failed ${rules.length - passedCount} out of ${rules.length} eligibility rules.`;

    return {
      isEligible,
      scoreRatio,
      passedCount,
      totalRules: rules.length,
      ruleResults,
      summary,
    };
  }
}

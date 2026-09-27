export interface ExtractedDocFields {
  documentType: string;
  applicantName?: string;
  fatherName?: string;
  certificateNumber?: string;
  issueDate?: string;
  issuingAuthority?: string;
  annualIncome?: number;
  casteTribeName?: string;
  marksPercentage?: number;
  institutionName?: string;
  passportNumber?: string;
  hasOfficialStamp?: boolean;
  hasSignature?: boolean;
  isBlurry?: boolean;
  rawText?: string;
}

export interface MismatchFlag {
  field: string;
  documentValue: string;
  formValue: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
}

export interface DocumentScanResult {
  extractedFields: ExtractedDocFields;
  ocrConfidenceScore: number; // 0 to 100
  mismatchFlags: MismatchFlag[];
  suggestedStatus: 'VERIFIED' | 'FLAGGED' | 'REJECTED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  deficiencyReasons: string[];
}

export class OCRService {
  /**
   * Simulates/executes intelligent OCR field extraction on a document.
   * Handles pattern parsing, stamp/signature verification, and field cross-matching.
   */
  public static async analyzeDocument(
    docType: string,
    fileName: string,
    fileBufferUrl: string,
    formData: Record<string, any>
  ): Promise<DocumentScanResult> {
    // Standard mock OCR extractor tuned for MoTA Document Intelligence Demo
    const extracted: ExtractedDocFields = {
      documentType: docType,
      hasOfficialStamp: true,
      hasSignature: true,
      isBlurry: false,
    };

    const mismatchFlags: MismatchFlag[] = [];
    const deficiencyReasons: string[] = [];
    let ocrConfidenceScore = 95.0;

    // Simulate OCR analysis based on file name or test parameters
    const lowerName = fileName.toLowerCase();

    if (lowerName.includes('blurry') || lowerName.includes('unclear')) {
      extracted.isBlurry = true;
      ocrConfidenceScore -= 40.0;
      deficiencyReasons.push('Document image is blurry or illegible. High-resolution scan required.');
    }

    if (lowerName.includes('nostamp') || lowerName.includes('unsigned')) {
      extracted.hasOfficialStamp = false;
      extracted.hasSignature = false;
      ocrConfidenceScore -= 30.0;
      deficiencyReasons.push('Official seal or issuing authority signature is missing on document.');
    }

    // Extracted field logic per document type
    switch (docType) {
      case 'INCOME_CERT': {
        const formIncome = Number(formData.annualIncome || 240000);
        // Introduce small variance or exact match based on demo trigger
        let extractedIncome = formIncome;
        if (lowerName.includes('mismatch')) {
          extractedIncome = formIncome + 150000;
        }

        extracted.applicantName = formData.fullName || 'Ramesh Kumar Oraon';
        extracted.annualIncome = extractedIncome;
        extracted.certificateNumber = `REV/INC/2025/${Math.floor(100000 + Math.random() * 900000)}`;
        extracted.issueDate = '2025-04-12';
        extracted.issuingAuthority = 'Tehsildar / District Revenue Officer, Ranchi';

        if (extractedIncome !== formIncome) {
          mismatchFlags.push({
            field: 'annualIncome',
            documentValue: `₹${extractedIncome.toLocaleString('en-IN')}`,
            formValue: `₹${formIncome.toLocaleString('en-IN')}`,
            severity: 'CRITICAL',
            description: `Income certificate specifies ₹${extractedIncome.toLocaleString('en-IN')}, but application form declares ₹${formIncome.toLocaleString('en-IN')}.`,
          });
          deficiencyReasons.push(`Income mismatch detected: Document ₹${extractedIncome} vs Form ₹${formIncome}.`);
          ocrConfidenceScore -= 25.0;
        }
        break;
      }

      case 'CASTE_CERT': {
        extracted.applicantName = formData.fullName || 'Ramesh Kumar Oraon';
        extracted.casteTribeName = formData.tribeName || 'Santhal (Scheduled Tribe)';
        extracted.certificateNumber = `ST/JH/2024/${Math.floor(100000 + Math.random() * 900000)}`;
        extracted.issuingAuthority = 'Sub-Divisional Magistrate (SDM), Dumka';
        extracted.issueDate = '2024-01-15';

        if (lowerName.includes('name_mismatch')) {
          extracted.applicantName = 'Ramesh K. Oram';
          mismatchFlags.push({
            field: 'applicantName',
            documentValue: 'Ramesh K. Oram',
            formValue: formData.fullName || 'Ramesh Kumar Oraon',
            severity: 'CRITICAL',
            description: "Spelling inconsistency on Caste Certificate vs Applicant's profile name.",
          });
          deficiencyReasons.push("Name on Caste Certificate does not match application record.");
          ocrConfidenceScore -= 20.0;
        }
        break;
      }

      case 'MARK_SHEET': {
        const formMarks = Number(formData.aggregateMarks || 78.5);
        extracted.applicantName = formData.fullName || 'Ramesh Kumar Oraon';
        extracted.marksPercentage = formMarks;
        extracted.institutionName = formData.institutionName || 'Indian Institute of Technology (IIT) Delhi';
        extracted.issueDate = '2025-06-20';
        break;
      }

      case 'ADMISSION_LETTER': {
        extracted.applicantName = formData.fullName || 'Ramesh Kumar Oraon';
        extracted.institutionName = formData.institutionName || 'University of Oxford / IIT Bombay';
        extracted.issueDate = '2025-05-10';
        break;
      }

      default:
        extracted.applicantName = formData.fullName || 'Applicant Name';
    }

    // Determine overall status & risk level
    let suggestedStatus: 'VERIFIED' | 'FLAGGED' | 'REJECTED' = 'VERIFIED';
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

    if (mismatchFlags.some(m => m.severity === 'CRITICAL') || deficiencyReasons.length > 0) {
      suggestedStatus = 'FLAGGED';
      riskLevel = ocrConfidenceScore < 60 ? 'HIGH' : 'MEDIUM';
    }

    if (extracted.isBlurry && deficiencyReasons.length > 1) {
      suggestedStatus = 'REJECTED';
      riskLevel = 'HIGH';
    }

    return {
      extractedFields: extracted,
      ocrConfidenceScore: Math.max(10, Math.min(100, Math.round(ocrConfidenceScore * 10) / 10)),
      mismatchFlags,
      suggestedStatus,
      riskLevel,
      deficiencyReasons,
    };
  }
}

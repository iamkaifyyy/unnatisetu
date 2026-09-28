import { Router, Request, Response } from 'express';
import { prisma } from '../services/db.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';
import { OCRService } from '../services/ocrService.js';
import { GeminiService } from '../services/geminiService.js';

const router = Router();

/**
 * Feature 1: AI-based Document Verification Endpoint
 * POST /api/documents/verify (and /api/v1/documents/verify)
 * Accepts uploaded document image/PDF + documentType + formData (+ optional applicationId / documentId / imageBase64)
 * Calls Gemini vision service to extract fields, detect missing items & form mismatches.
 * Returns advisory result with fieldsFound, fieldsMissing, mismatches, confidence, advisoryNote.
 * Retains human oversight (never auto-rejects).
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { documentType, fileName = 'document.png', formData = {}, imageBase64, applicationId, documentId } = req.body;

    let targetFormData = formData;

    if (applicationId && Object.keys(formData).length === 0) {
      const app = await prisma.application.findUnique({ where: { id: applicationId } });
      if (app) {
        targetFormData = JSON.parse(app.formDataJson || '{}');
      }
    }

    const verifyResult = await GeminiService.verifyDocument(documentType, fileName, targetFormData, imageBase64);

    // If an existing documentId or applicationId is provided, attach the advisory flags for human scrutiny
    if (documentId) {
      await prisma.document.update({
        where: { id: documentId },
        data: {
          verificationStatus: verifyResult.mismatches.length > 0 || verifyResult.fieldsMissing.length > 0 ? 'FLAGGED' : 'VERIFIED',
          mismatchFlagsJson: JSON.stringify(verifyResult.mismatches),
          ocrConfidenceScore: parseFloat(verifyResult.confidence) || 88.0,
        },
      });
    }

    return res.json(verifyResult);
  } catch (err: any) {
    console.error('[Document Verify Endpoint Error]:', err);
    return res.status(500).json({ error: err.message });
  }
});

// OCR Scan & Save Document
router.post('/upload', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { applicationId, documentType, fileName, fileUrl = '/sample-docs/caste_certificate.png' } = req.body;

    const app = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const formData = JSON.parse(app.formDataJson || '{}');

    // Run OCR scan & Gemini Verification
    const scanResult = await OCRService.analyzeDocument(documentType, fileName || 'document.png', fileUrl, formData);
    const geminiCheck = await GeminiService.verifyDocument(documentType, fileName || 'document.png', formData);

    // Store in DB with advisory human oversight status
    const doc = await prisma.document.create({
      data: {
        applicationId,
        type: documentType,
        fileName: fileName || `${documentType.toLowerCase()}.png`,
        fileUrl,
        ocrExtractedJson: JSON.stringify(geminiCheck.fieldsFound || scanResult.extractedFields),
        ocrConfidenceScore: parseFloat(geminiCheck.confidence) || scanResult.ocrConfidenceScore,
        verificationStatus: geminiCheck.mismatches.length > 0 || geminiCheck.fieldsMissing.length > 0 ? 'FLAGGED' : scanResult.suggestedStatus,
        mismatchFlagsJson: JSON.stringify(geminiCheck.mismatches.length > 0 ? geminiCheck.mismatches : scanResult.mismatchFlags),
      },
    });

    return res.json({
      message: 'Document analyzed & uploaded successfully',
      document: {
        ...doc,
        ocrExtracted: geminiCheck.fieldsFound,
        mismatchFlags: geminiCheck.mismatches,
        deficiencyReasons: geminiCheck.fieldsMissing,
        suggestedStatus: doc.verificationStatus,
        advisoryNote: geminiCheck.advisoryNote,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get Document Diff View
router.get('/:id/diff', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const doc = await prisma.document.findUnique({
      where: { id: req.params.id },
      include: {
        application: {
          include: { user: true },
        },
      },
    });

    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const formData = JSON.parse(doc.application.formDataJson || '{}');
    const ocrExtracted = JSON.parse(doc.ocrExtractedJson || '{}');
    const mismatchFlags = JSON.parse(doc.mismatchFlagsJson || '[]');

    return res.json({
      documentId: doc.id,
      documentType: doc.type,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      ocrConfidenceScore: doc.ocrConfidenceScore,
      verificationStatus: doc.verificationStatus,
      advisoryNotice: doc.verificationStatus === 'FLAGGED' ? 'AI-flagged, pending human review.' : 'Verified by system & verifier.',
      formData,
      ocrExtracted,
      mismatchFlags,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

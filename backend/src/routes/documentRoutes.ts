import { Router, Response } from 'express';
import { prisma } from '../services/db.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';
import { OCRService } from '../services/ocrService.js';

const router = Router();

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

    // Run Document Intelligence & OCR Extraction
    const scanResult = await OCRService.analyzeDocument(documentType, fileName || 'document.png', fileUrl, formData);

    // Store in DB
    const doc = await prisma.document.create({
      data: {
        applicationId,
        type: documentType,
        fileName: fileName || `${documentType.toLowerCase()}.png`,
        fileUrl,
        ocrExtractedJson: JSON.stringify(scanResult.extractedFields),
        ocrConfidenceScore: scanResult.ocrConfidenceScore,
        verificationStatus: scanResult.suggestedStatus,
        mismatchFlagsJson: JSON.stringify(scanResult.mismatchFlags),
      },
    });

    return res.json({
      message: 'Document analyzed & uploaded successfully',
      document: {
        ...doc,
        ocrExtracted: scanResult.extractedFields,
        mismatchFlags: scanResult.mismatchFlags,
        deficiencyReasons: scanResult.deficiencyReasons,
        suggestedStatus: scanResult.suggestedStatus,
        riskLevel: scanResult.riskLevel,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get Document OCR & Form Mismatch Diff View
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
      formData,
      ocrExtracted,
      mismatchFlags,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

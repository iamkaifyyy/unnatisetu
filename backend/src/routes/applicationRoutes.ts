import { Router, Response } from 'express';
import { prisma } from '../services/db.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';
import { EligibilityEngine } from '../services/eligibilityEngine.js';
import { AuditLogger } from '../services/auditLogger.js';
import { PDFService } from '../services/pdfService.js';

const router = Router();

// Get Applicant's own applications
router.get('/my', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user!.id },
      include: {
        scheme: true,
        documents: true,
        deficiencies: { where: { status: 'OPEN' } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const parsed = applications.map((a) => ({
      ...a,
      formData: JSON.parse(a.formDataJson || '{}'),
    }));

    return res.json({ applications: parsed });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Create/Update Draft Application (Autosave)
router.post('/draft', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { schemeId, formData, applicationId } = req.body;

    const scheme = await prisma.scheme.findUnique({
      where: { id: schemeId },
      include: { configs: { where: { isActive: true }, take: 1 } },
    });

    if (!scheme) {
      return res.status(404).json({ error: 'Scheme not found' });
    }

    const activeConfig = scheme.configs[0];
    const configVersion = activeConfig ? activeConfig.version : 1;

    let app;
    if (applicationId) {
      app = await prisma.application.update({
        where: { id: applicationId },
        data: {
          formDataJson: JSON.stringify(formData || {}),
          schemeConfigVersion: configVersion,
          updatedAt: new Date(),
        },
      });
    } else {
      const count = await prisma.application.count();
      const appNo = `MOTA-${scheme.code}-2026-${String(count + 1).padStart(5, '0')}`;

      app = await prisma.application.create({
        data: {
          applicationNo: appNo,
          userId: req.user!.id,
          schemeId,
          schemeConfigVersion: configVersion,
          status: 'DRAFT',
          formDataJson: JSON.stringify(formData || {}),
        },
      });
    }

    return res.json({
      message: 'Application draft saved',
      application: {
        ...app,
        formData: JSON.parse(app.formDataJson || '{}'),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Submit Application
router.post('/:id/submit', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const app = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: {
        scheme: {
          include: { configs: { where: { isActive: true }, take: 1 } },
        },
        documents: true,
      },
    });

    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const formData = JSON.parse(app.formDataJson || '{}');
    const activeConfig = app.scheme.configs[0];
    const rules = activeConfig ? JSON.parse(activeConfig.eligibilityRulesJson || '[]') : [];

    // Run deterministic Eligibility Engine check
    const evalResult = EligibilityEngine.evaluate(formData, rules);

    // Compute initial AI Confidence Score from document scan confidence
    const docConfidences = app.documents.map((d) => d.ocrConfidenceScore);
    const avgDocConf = docConfidences.length > 0 ? docConfidences.reduce((a, b) => a + b, 0) / docConfidences.length : 85.0;

    const overallConfidence = Math.round((evalResult.scoreRatio * 50 + (avgDocConf / 100) * 50) * 10) / 10;
    const riskLevel = overallConfidence < 70 ? 'HIGH' : overallConfidence < 85 ? 'MEDIUM' : 'LOW';

    const updatedApp = await prisma.application.update({
      where: { id: app.id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
        aiConfidenceScore: overallConfidence,
        riskLevel,
      },
    });

    // Audit Log
    await AuditLogger.log({
      applicationId: app.id,
      actorId: req.user!.id,
      actorRole: req.user!.role,
      action: 'APPLICATION_SUBMITTED',
      reason: 'Applicant completed & submitted application',
      previousState: app.status,
      newState: 'SUBMITTED',
      metadata: { evaluationSummary: evalResult.summary, confidence: overallConfidence },
    });

    // Send Notification
    await prisma.notification.create({
      data: {
        userId: req.user!.id,
        type: 'STATUS_UPDATE',
        title: 'Application Submitted Successfully',
        message: `Your application ${app.applicationNo} for ${app.scheme.name} has been submitted and is queued for verification.`,
      },
    });

    return res.json({
      message: 'Application submitted successfully',
      application: updatedApp,
      eligibilityEvaluation: evalResult,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get Application Detail (Single view)
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const app = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: {
        scheme: {
          include: { configs: { where: { isActive: true }, take: 1 } },
        },
        user: { select: { fullName: true, email: true, phone: true, state: true, district: true, category: true, digilockerId: true } },
        documents: true,
        deficiencies: { orderBy: { createdAt: 'desc' } },
        auditLogs: { include: { actor: { select: { fullName: true, role: true } } }, orderBy: { timestamp: 'desc' } },
        meritEntry: true,
      },
    });

    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const formData = JSON.parse(app.formDataJson || '{}');
    const activeConfig = app.scheme.configs[0];
    const rules = activeConfig ? JSON.parse(activeConfig.eligibilityRulesJson || '[]') : [];

    const eligibilityEval = EligibilityEngine.evaluate(formData, rules);

    const parsedDocs = app.documents.map((d) => ({
      ...d,
      ocrExtracted: JSON.parse(d.ocrExtractedJson || '{}'),
      mismatchFlags: JSON.parse(d.mismatchFlagsJson || '[]'),
    }));

    return res.json({
      application: {
        ...app,
        formData,
        documents: parsedDocs,
        eligibilityEval,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Download PDF Acknowledgment / Provisional Selection Letter
router.get('/:id/pdf', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const app = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { scheme: true, user: true },
    });

    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const formData = JSON.parse(app.formDataJson || '{}');

    const pdfBuffer = await PDFService.createApplicationSlip({
      applicationNo: app.applicationNo,
      applicantName: app.user.fullName,
      schemeName: app.scheme.name,
      schemeCode: app.scheme.code,
      status: app.status,
      submittedAt: app.submittedAt ? app.submittedAt.toISOString().split('T')[0] : 'Draft',
      state: app.user.state || 'Jharkhand',
      category: app.user.category || 'ST',
      annualIncome: formData.annualIncome ? `₹${Number(formData.annualIncome).toLocaleString('en-IN')}` : '₹2,40,000',
      institutionName: formData.institutionName || 'IIT Delhi / University of Oxford',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${app.applicationNo}_Acknowledgment.pdf"`);
    return res.send(pdfBuffer);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

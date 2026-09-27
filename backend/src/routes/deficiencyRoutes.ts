import { Router, Response } from 'express';
import { prisma } from '../services/db.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';
import { AuditLogger } from '../services/auditLogger.ts';

const router = Router();

// Resolve Deficiency Notice
router.post('/:id/resolve', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const deficiencyId = req.params.id;
    const { responseNotes, reUploadedDocumentId } = req.body;

    const deficiency = await prisma.deficiencyNotice.findUnique({
      where: { id: deficiencyId },
      include: { application: true },
    });

    if (!deficiency) {
      return res.status(404).json({ error: 'Deficiency notice not found' });
    }

    // Update Deficiency Notice
    const updatedDeficiency = await prisma.deficiencyNotice.update({
      where: { id: deficiencyId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        remarks: responseNotes ? `Applicant Note: ${responseNotes}` : deficiency.remarks,
      },
    });

    // Move Application to RESUBMITTED
    const updatedApp = await prisma.application.update({
      where: { id: deficiency.applicationId },
      data: {
        status: 'RESUBMITTED',
        updatedAt: new Date(),
      },
    });

    // Audit Log
    await AuditLogger.log({
      applicationId: deficiency.applicationId,
      actorId: req.user!.id,
      actorRole: req.user!.role,
      action: 'DEFICIENCY_RESOLVED',
      reason: responseNotes || 'Applicant re-uploaded document to resolve deficiency',
      previousState: 'DEFICIENCY_RAISED',
      newState: 'RESUBMITTED',
    });

    return res.json({
      message: 'Deficiency resolved and application resubmitted to verification queue.',
      deficiency: updatedDeficiency,
      application: updatedApp,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

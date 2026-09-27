import { Router, Response } from 'express';
import { prisma } from '../services/db.js';
import { AuthRequest, authenticateToken, requireRoles } from '../middleware/auth.js';
import { AuditLogger } from '../services/auditLogger.ts';
import { ApplicationStatus, RiskLevel } from '@prisma/client';

const router = Router();

// Get Central Verification Queue
router.get(
  '/queue',
  authenticateToken,
  requireRoles(['VERIFIER', 'STATE_ADMIN', 'MINISTRY_ADMIN']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { schemeId, state, status, riskLevel, search } = req.query;

      const where: any = {};

      if (schemeId) where.schemeId = String(schemeId);
      if (state) where.user = { state: String(state) };
      if (status) where.status = String(status) as ApplicationStatus;
      if (riskLevel) where.riskLevel = String(riskLevel) as RiskLevel;

      if (search) {
        where.OR = [
          { applicationNo: { contains: String(search) } },
          { user: { fullName: { contains: String(search) } } },
        ];
      }

      // Default queue status filter if none provided
      if (!status) {
        where.status = {
          in: ['SUBMITTED', 'UNDER_SCRUTINY', 'RESUBMITTED', 'DEFICIENCY_RAISED'],
        };
      }

      const applications = await prisma.application.findMany({
        where,
        include: {
          scheme: true,
          user: { select: { fullName: true, email: true, state: true, district: true, category: true, digilockerId: true } },
          documents: true,
          deficiencies: { where: { status: 'OPEN' } },
        },
        orderBy: [{ riskLevel: 'desc' }, { submittedAt: 'asc' }],
      });

      const parsed = applications.map((a) => ({
        ...a,
        formData: JSON.parse(a.formDataJson || '{}'),
      }));

      return res.json({ queue: parsed, count: parsed.length });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// Single Scrutiny Action (Approve, Raise Deficiency, Flag, Escalate)
router.post(
  '/:id/action',
  authenticateToken,
  requireRoles(['VERIFIER', 'STATE_ADMIN', 'MINISTRY_ADMIN']),
  async (req: AuthRequest, res: Response) => {
    try {
      const applicationId = req.params.id;
      const { action, reason, deficiencyRemarks, deficiencyCategory = 'DOCUMENT_MISMATCH', deadlineDays = 7 } = req.body;

      const app = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { user: true, scheme: true },
      });

      if (!app) {
        return res.status(404).json({ error: 'Application not found' });
      }

      let newStatus: ApplicationStatus = app.status;

      switch (action) {
        case 'APPROVE':
          newStatus = 'SHORTLISTED';
          break;
        case 'RAISE_DEFICIENCY':
          newStatus = 'DEFICIENCY_RAISED';
          break;
        case 'REJECT':
          newStatus = 'REJECTED';
          break;
        case 'ESCALATE':
          newStatus = 'UNDER_SCRUTINY';
          break;
        default:
          return res.status(400).json({ error: `Invalid verification action: ${action}` });
      }

      // Update Application
      const updatedApp = await prisma.application.update({
        where: { id: applicationId },
        data: {
          status: newStatus,
          currentAssigneeId: req.user!.id,
        },
      });

      // Handle Deficiency Creation if action is RAISE_DEFICIENCY
      if (action === 'RAISE_DEFICIENCY') {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + Number(deadlineDays));

        await prisma.deficiencyNotice.create({
          data: {
            applicationId,
            raisedById: req.user!.id,
            reason: reason || 'Document mismatch detected during officer scrutiny.',
            remarks: deficiencyRemarks || 'Please re-upload clear, valid document.',
            category: deficiencyCategory,
            deadline,
            status: 'OPEN',
          },
        });

        // Send Notification to Applicant
        await prisma.notification.create({
          data: {
            userId: app.userId,
            type: 'DEFICIENCY_RAISED',
            title: 'Action Required: Deficiency Raised on Your Application',
            message: `A deficiency has been raised for Application ${app.applicationNo}. Reason: ${reason}. Please resolve before deadline.`,
          },
        });
      }

      // Log Audit Trail
      await AuditLogger.log({
        applicationId,
        actorId: req.user!.id,
        actorRole: req.user!.role,
        action: `VERIFICATION_${action}`,
        reason: reason || `Officer performed ${action}`,
        previousState: app.status,
        newState: newStatus,
      });

      return res.json({
        message: `Application status updated to ${newStatus}`,
        application: updatedApp,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// Bulk Verification Action
router.post(
  '/bulk-action',
  authenticateToken,
  requireRoles(['VERIFIER', 'STATE_ADMIN', 'MINISTRY_ADMIN']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { applicationIds, action, reason } = req.body;

      if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
        return res.status(400).json({ error: 'No application IDs provided for bulk action' });
      }

      let newStatus: ApplicationStatus = 'SHORTLISTED';
      if (action === 'REJECT') newStatus = 'REJECTED';
      if (action === 'ESCALATE') newStatus = 'UNDER_SCRUTINY';

      await prisma.application.updateMany({
        where: { id: { in: applicationIds } },
        data: { status: newStatus, currentAssigneeId: req.user!.id },
      });

      // Write Audit Logs in bulk
      for (const appId of applicationIds) {
        await AuditLogger.log({
          applicationId: appId,
          actorId: req.user!.id,
          actorRole: req.user!.role,
          action: `BULK_${action}`,
          reason: reason || `Bulk officer action: ${action}`,
          newState: newStatus,
        });
      }

      return res.json({
        message: `Successfully processed bulk ${action} for ${applicationIds.length} applications.`,
        processedCount: applicationIds.length,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

export default router;

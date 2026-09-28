import { Router, Response } from 'express';
import { prisma } from '../services/db.js';
import { AuthRequest, authenticateToken, requireRoles } from '../middleware/auth.js';
import { MeritEngine, MeritCalculationInput } from '../services/meritEngine.js';
import { AuditLogger } from '../services/auditLogger.js';

const router = Router();

// Generate / Calculate Merit List for a Scheme
router.post(
  '/generate',
  authenticateToken,
  requireRoles(['STATE_ADMIN', 'MINISTRY_ADMIN']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { schemeId } = req.body;

      const scheme = await prisma.scheme.findUnique({
        where: { id: schemeId },
        include: { configs: { where: { isActive: true }, take: 1 } },
      });

      if (!scheme) {
        return res.status(404).json({ error: 'Scheme not found' });
      }

      const activeConfig = scheme.configs[0];
      const scoringWeightage = activeConfig ? JSON.parse(activeConfig.scoringWeightageJson || '{}') : {};

      // Fetch all shortlisted or submitted applications for this scheme
      const applications = await prisma.application.findMany({
        where: {
          schemeId,
          status: { in: ['SHORTLISTED', 'SUBMITTED', 'UNDER_SCRUTINY', 'RESUBMITTED', 'SELECTED'] },
        },
        include: { user: true },
      });

      const inputs: MeritCalculationInput[] = applications.map((app) => {
        const formData = JSON.parse(app.formDataJson || '{}');
        return {
          applicationId: app.id,
          applicationNo: app.applicationNo,
          applicantName: app.user.fullName,
          state: app.user.state || 'Jharkhand',
          category: app.user.category || 'ST',
          academicMarks: Number(formData.aggregateMarks || 75.0),
          annualIncome: Number(formData.annualIncome || 240000),
          isPVTG: Boolean(formData.isPVTG || app.user.pvtgGroup),
          isFemale: formData.gender === 'Female',
          submittedAt: app.submittedAt || app.createdAt,
        };
      });

      // Calculate Scores and Ranks
      const meritList = MeritEngine.calculateMeritList(inputs, scoringWeightage);

      // Upsert into DB MeritEntry
      for (const item of meritList) {
        await prisma.meritEntry.upsert({
          where: { applicationId: item.applicationId },
          update: {
            computedScore: item.computedScore,
            scoreBreakdownJson: JSON.stringify(item.scoreBreakdown),
            rank: item.rank,
            category: item.category,
            state: item.state,
          },
          create: {
            applicationId: item.applicationId,
            schemeId,
            computedScore: item.computedScore,
            scoreBreakdownJson: JSON.stringify(item.scoreBreakdown),
            rank: item.rank,
            category: item.category,
            state: item.state,
          },
        });
      }

      return res.json({
        message: `Merit list generated for ${meritList.length} candidates`,
        meritList,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// Get Merit List for a Scheme
router.get('/:schemeId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const meritEntries = await prisma.meritEntry.findMany({
      where: { schemeId: req.params.schemeId },
      include: {
        application: {
          include: {
            user: { select: { fullName: true, email: true, state: true, district: true, category: true } },
          },
        },
        overriddenBy: { select: { fullName: true } },
      },
      orderBy: { rank: 'asc' },
    });

    const parsed = meritEntries.map((m) => ({
      ...m,
      scoreBreakdown: JSON.parse(m.scoreBreakdownJson || '{}'),
      formData: JSON.parse(m.application.formDataJson || '{}'),
    }));

    return res.json({ meritList: parsed });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Manual Override Candidate Rank / Selection (Human Oversight Audit)
router.post(
  '/:id/override',
  authenticateToken,
  requireRoles(['MINISTRY_ADMIN']),
  async (req: AuthRequest, res: Response) => {
    try {
      const meritEntryId = req.params.id;
      const { newRank, overrideReason } = req.body;

      if (!overrideReason || overrideReason.trim().length < 10) {
        return res.status(400).json({ error: 'Mandatory justification required for manual merit override (min 10 characters).' });
      }

      const existing = await prisma.meritEntry.findUnique({
        where: { id: meritEntryId },
        include: { application: true },
      });

      if (!existing) {
        return res.status(404).json({ error: 'Merit entry not found' });
      }

      const prevRank = existing.rank;

      const updated = await prisma.meritEntry.update({
        where: { id: meritEntryId },
        data: {
          rank: Number(newRank),
          isOverridden: true,
          overrideReason,
          overriddenById: req.user!.id,
        },
      });

      // Log Audit Trail for Manual Override
      await AuditLogger.log({
        applicationId: existing.applicationId,
        actorId: req.user!.id,
        actorRole: req.user!.role,
        action: 'MANUAL_MERIT_OVERRIDE',
        reason: overrideReason,
        previousState: `Rank #${prevRank}`,
        newState: `Rank #${newRank}`,
        metadata: { prevRank, newRank, overrideReason },
      });

      return res.json({
        message: 'Merit rank overridden with mandatory human justification logged.',
        meritEntry: updated,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// Publish & Lock Final Selection List
router.post(
  '/:schemeId/publish',
  authenticateToken,
  requireRoles(['MINISTRY_ADMIN']),
  async (req: AuthRequest, res: Response) => {
    try {
      const { schemeId } = req.params;
      const { cutoffRank = 50 } = req.body;

      const meritEntries = await prisma.meritEntry.findMany({
        where: { schemeId },
        orderBy: { rank: 'asc' },
      });

      let selectedCount = 0;
      const now = new Date();

      for (const entry of meritEntries) {
        const isSelected = entry.rank <= cutoffRank;
        const newStatus = isSelected ? 'SELECTED' : 'WAITLISTED';

        await prisma.meritEntry.update({
          where: { id: entry.id },
          data: { publishedAt: now },
        });

        await prisma.application.update({
          where: { id: entry.applicationId },
          data: { status: newStatus },
        });

        // Notify Student
        await prisma.notification.create({
          data: {
            userId: entry.applicationId,
            type: 'MERIT_SELECTION',
            title: isSelected ? 'Congratulations! You Have Been Selected' : 'Waitlisted Status Update',
            message: isSelected
              ? `You have been selected under Rank #${entry.rank} for the fellowship!`
              : `You are currently on the waitlist at Rank #${entry.rank}.`,
          },
        });

        if (isSelected) selectedCount++;
      }

      return res.json({
        message: `Final merit list published! ${selectedCount} candidates selected, ${meritEntries.length - selectedCount} waitlisted.`,
        selectedCount,
        publishedAt: now,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

export default router;

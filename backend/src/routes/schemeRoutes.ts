import { Router, Response } from 'express';
import { prisma } from '../services/db.js';
import { AuthRequest, authenticateToken, requireRoles } from '../middleware/auth.js';

const router = Router();

// List Schemes with active config
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const schemes = await prisma.scheme.findMany({
      include: {
        configs: {
          where: { isActive: true },
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const parsed = schemes.map((s) => {
      const activeConfig = s.configs[0];
      return {
        ...s,
        activeConfig: activeConfig
          ? {
              ...activeConfig,
              eligibilityRules: JSON.parse(activeConfig.eligibilityRulesJson || '[]'),
              requiredDocuments: JSON.parse(activeConfig.requiredDocumentsJson || '[]'),
              scoringWeightage: JSON.parse(activeConfig.scoringWeightageJson || '{}'),
              tieBreakerRules: JSON.parse(activeConfig.tieBreakerRulesJson || '[]'),
            }
          : null,
      };
    });

    return res.json({ schemes: parsed });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get Single Scheme with full config details
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const scheme = await prisma.scheme.findUnique({
      where: { id: req.params.id },
      include: {
        configs: {
          orderBy: { version: 'desc' },
        },
      },
    });

    if (!scheme) {
      return res.status(404).json({ error: 'Scheme not found' });
    }

    const configsParsed = scheme.configs.map((c) => ({
      ...c,
      eligibilityRules: JSON.parse(c.eligibilityRulesJson || '[]'),
      requiredDocuments: JSON.parse(c.requiredDocumentsJson || '[]'),
      scoringWeightage: JSON.parse(c.scoringWeightageJson || '{}'),
      tieBreakerRules: JSON.parse(c.tieBreakerRulesJson || '[]'),
    }));

    return res.json({
      scheme: {
        ...scheme,
        configs: configsParsed,
        activeConfig: configsParsed[0] || null,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Create/Update Scheme Config (Versioned - creates a new SchemeConfig version)
router.post(
  '/:id/config',
  authenticateToken,
  requireRoles(['STATE_ADMIN', 'MINISTRY_ADMIN']),
  async (req: AuthRequest, res: Response) => {
    try {
      const schemeId = req.params.id;
      const { eligibilityRules, requiredDocuments, scoringWeightage, tieBreakerRules } = req.body;

      const latestConfig = await prisma.schemeConfig.findFirst({
        where: { schemeId },
        orderBy: { version: 'desc' },
      });

      const nextVersion = (latestConfig?.version || 0) + 1;

      // Deactivate previous configs
      await prisma.schemeConfig.updateMany({
        where: { schemeId },
        data: { isActive: false },
      });

      const newConfig = await prisma.schemeConfig.create({
        data: {
          schemeId,
          version: nextVersion,
          isActive: true,
          eligibilityRulesJson: JSON.stringify(eligibilityRules || []),
          requiredDocumentsJson: JSON.stringify(requiredDocuments || []),
          scoringWeightageJson: JSON.stringify(scoringWeightage || {}),
          tieBreakerRulesJson: JSON.stringify(tieBreakerRules || []),
        },
      });

      return res.json({
        message: `Scheme configuration version ${nextVersion} published successfully`,
        config: {
          ...newConfig,
          eligibilityRules,
          requiredDocuments,
          scoringWeightage,
          tieBreakerRules,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// Clone Scheme feature
router.post(
  '/:id/clone',
  authenticateToken,
  requireRoles(['MINISTRY_ADMIN']),
  async (req: AuthRequest, res: Response) => {
    try {
      const sourceScheme = await prisma.scheme.findUnique({
        where: { id: req.params.id },
        include: { configs: { where: { isActive: true }, take: 1 } },
      });

      if (!sourceScheme) {
        return res.status(404).json({ error: 'Source scheme not found' });
      }

      const { newCode, newName, newDescription } = req.body;

      const clonedScheme = await prisma.scheme.create({
        data: {
          code: newCode || `${sourceScheme.code}_COPY`,
          name: newName || `${sourceScheme.name} (Cloned)`,
          description: newDescription || sourceScheme.description,
          portalType: sourceScheme.portalType,
          applicationWindowStart: new Date(),
          applicationWindowEnd: new Date(Date.now() + 90 * 84600 * 1000),
          budgetAllocation: 40000000,
          totalSeats: 300,
        },
      });

      const sourceConfig = sourceScheme.configs[0];
      if (sourceConfig) {
        await prisma.schemeConfig.create({
          data: {
            schemeId: clonedScheme.id,
            version: 1,
            isActive: true,
            eligibilityRulesJson: sourceConfig.eligibilityRulesJson,
            requiredDocumentsJson: sourceConfig.requiredDocumentsJson,
            scoringWeightageJson: sourceConfig.scoringWeightageJson,
            tieBreakerRulesJson: sourceConfig.tieBreakerRulesJson,
          },
        });
      }

      return res.json({
        message: 'Scheme cloned successfully',
        scheme: clonedScheme,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

export default router;

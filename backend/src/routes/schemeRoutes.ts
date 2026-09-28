import { Router, Response } from 'express';
import { prisma } from '../services/db.js';
import { AuthRequest, authenticateToken, requireRoles } from '../middleware/auth.js';

const router = Router();

/**
 * Official Ministry of Tribal Affairs Schemes Dataset
 * Sourced directly from dbttribal.gov.in & tribal.nic.in
 */
const officialSchemesDataset = [
  {
    code: 'BPVGK',
    name: 'Pre-Matric Scholarship Scheme For ST Student',
    description: 'Centrally Sponsored Scheme providing financial support to ST students studying in Classes IX and X to minimize dropout rates and foster secondary education. Benefit Type: In Cash.',
    portalType: 'SCHOLARSHIP',
    applicationWindowStart: new Date('2026-01-01'),
    applicationWindowEnd: new Date('2026-12-31'),
    budgetAllocation: 120000000.0,
    budgetUtilized: 45000000.0,
    totalSeats: 15000,
    eligibilityRules: [
      { id: 'rule_p1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 250000, description: 'Annual family income must not exceed ₹2,50,000/-' },
      { id: 'rule_p2', field: 'category', label: 'ST Category Verification', operator: '==', value: 'ST', description: 'Must belong to a notified Scheduled Tribe.' },
      { id: 'rule_p3', field: 'currentClass', label: 'Class IX or X Enrollment', operator: 'in', value: ['Class IX', 'Class X'], description: 'Must be studying in Class IX or X in a recognized school.' },
    ],
    requiredDocuments: [
      { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
      { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
      { type: 'MARK_SHEET', name: 'Class VIII / IX Marksheet', required: true },
    ],
    scoringWeightage: { academicMarksWeight: 50, incomeWeight: 30, pvtgBonus: 15, femaleBonus: 5, maxIncomeCap: 250000 },
    tieBreakerRules: ['lower_family_income', 'older_age', 'earlier_submission_time'],
  },
  {
    code: 'BVOBC',
    name: 'Post-Matric Scholarship Scheme For ST Students',
    description: 'Centrally Sponsored Scheme to provide financial assistance to ST students studying at post-secondary / post-matriculation stage (Classes XI, XII, UG, PG, Diploma). Benefit Type: In Cash.',
    portalType: 'SCHOLARSHIP',
    applicationWindowStart: new Date('2026-01-01'),
    applicationWindowEnd: new Date('2026-12-31'),
    budgetAllocation: 250000000.0,
    budgetUtilized: 110000000.0,
    totalSeats: 25000,
    eligibilityRules: [
      { id: 'rule_pm1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 250000, description: 'Annual family income must not exceed ₹2,50,000/-' },
      { id: 'rule_pm2', field: 'category', label: 'ST Category Verification', operator: '==', value: 'ST', description: 'Must belong to a notified Scheduled Tribe.' },
      { id: 'rule_pm3', field: 'isRecognizedCollege', label: 'Recognized College / University', operator: '==', value: true, description: 'Must be enrolled in a post-secondary course.' },
    ],
    requiredDocuments: [
      { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
      { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
      { type: 'MARK_SHEET', name: 'Class X / XII / Graduation Marksheet', required: true },
    ],
    scoringWeightage: { academicMarksWeight: 50, incomeWeight: 30, pvtgBonus: 15, femaleBonus: 5, maxIncomeCap: 250000 },
    tieBreakerRules: ['lower_family_income', 'older_age', 'earlier_submission_time'],
  },
  {
    code: 'A023B',
    name: 'Top Class Education For ST Students',
    description: 'Central Sector Scheme providing full tuition fee reimbursement and living expenses for meritorious ST students admitted to premier notified institutes (IITs, IIMs, NITs, AIIMS, NIFTs, NLUs). Benefit Type: In Cash.',
    portalType: 'SCHOLARSHIP',
    applicationWindowStart: new Date('2026-01-10'),
    applicationWindowEnd: new Date('2026-11-30'),
    budgetAllocation: 60000000.0,
    budgetUtilized: 25000000.0,
    totalSeats: 1000,
    eligibilityRules: [
      { id: 'rule_tc1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 600000, description: 'Family annual income must not exceed ₹6,00,000/-' },
      { id: 'rule_tc2', field: 'category', label: 'ST Category Verification', operator: '==', value: 'ST', description: 'Must belong to a notified Scheduled Tribe.' },
      { id: 'rule_tc3', field: 'isTopClassInstitute', label: 'Notified Premier Institute', operator: '==', value: true, description: 'Must be admitted into a MoTA notified Top Class Premier Institute (IIT, IIM, NIT, AIIMS, NLU, etc.).' },
    ],
    requiredDocuments: [
      { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
      { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
      { type: 'ADMISSION_LETTER', name: 'Institute Fee Structure & Admission Offer', required: true },
    ],
    scoringWeightage: { academicMarksWeight: 50, incomeWeight: 30, pvtgBonus: 15, femaleBonus: 5, maxIncomeCap: 600000 },
    tieBreakerRules: ['lower_family_income', 'older_age', 'earlier_submission_time'],
  },
  {
    code: 'ARG45',
    name: 'National Fellowship for ST Students',
    description: 'Central Sector Scheme providing financial assistance/fellowship to Scheduled Tribe students for pursuing M.Phil / Ph.D in Humanities, Sciences, and Engineering at premier Indian Universities. Benefit Type: In Cash.',
    portalType: 'FELLOWSHIP',
    applicationWindowStart: new Date('2026-01-01'),
    applicationWindowEnd: new Date('2026-12-31'),
    budgetAllocation: 55000000.0,
    budgetUtilized: 21000000.0,
    totalSeats: 750,
    eligibilityRules: [
      { id: 'rule_nf1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 600000, description: 'Family annual income from all sources must not exceed ₹6,00,000/-' },
      { id: 'rule_nf2', field: 'aggregateMarks', label: 'Post-Graduation Minimum Marks', operator: '>=', value: 55, description: 'Must have secured a minimum of 55% aggregate marks in PG Degree.' },
      { id: 'rule_nf3', field: 'category', label: 'Category Verification', operator: '==', value: 'ST', description: 'Applicant must belong to a notified Scheduled Tribe community.' },
      { id: 'rule_nf4', field: 'isApprovedInstitution', label: 'MoTA Approved University / Institute', operator: '==', value: true, description: 'Course must be pursued at a UGC/MoE accredited premier institution.' },
    ],
    requiredDocuments: [
      { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
      { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
      { type: 'MARK_SHEET', name: 'Post-Graduation Marksheet / Degree', required: true },
      { type: 'ADMISSION_LETTER', name: 'Ph.D / M.Phil Admission Offer Letter', required: true },
    ],
    scoringWeightage: { academicMarksWeight: 50, incomeWeight: 30, pvtgBonus: 15, femaleBonus: 5, maxIncomeCap: 600000 },
    tieBreakerRules: ['lower_family_income', 'older_age', 'earlier_submission_time'],
  },
  {
    code: 'AZKMI',
    name: 'National Overseas Scholarship Scheme',
    description: 'Central Sector Scheme providing financial support for selected ST students pursuing Master Degree, Ph.D, and Post-Doctoral research in top 500 foreign universities abroad. Benefit Type: In Others.',
    portalType: 'SCHOLARSHIP',
    applicationWindowStart: new Date('2026-01-15'),
    applicationWindowEnd: new Date('2026-11-30'),
    budgetAllocation: 80000000.0,
    budgetUtilized: 34000000.0,
    totalSeats: 120,
    eligibilityRules: [
      { id: 'rule_nos1', field: 'annualIncome', label: 'Family Annual Income Cap', operator: '<=', value: 600000, description: 'Family annual income must not exceed ₹6,00,000/-' },
      { id: 'rule_nos2', field: 'aggregateMarks', label: 'Qualifying Exam Minimum Marks', operator: '>=', value: 60, description: 'Must have secured a minimum of 60% aggregate marks in qualifying exam.' },
      { id: 'rule_nos3', field: 'passportValid', label: 'Valid Indian Passport', operator: '==', value: true, description: 'Must possess a valid Indian passport.' },
    ],
    requiredDocuments: [
      { type: 'CASTE_CERT', name: 'ST Tribe / Caste Certificate', required: true },
      { type: 'INCOME_CERT', name: 'Income Certificate (Current FY)', required: true },
      { type: 'PASSPORT', name: 'Valid Passport Copy', required: true },
      { type: 'ADMISSION_LETTER', name: 'Foreign University Unconditional Offer Letter', required: true },
    ],
    scoringWeightage: { academicMarksWeight: 50, incomeWeight: 30, pvtgBonus: 15, femaleBonus: 5, maxIncomeCap: 600000 },
    tieBreakerRules: ['lower_family_income', 'older_age', 'earlier_submission_time'],
  },
];

async function ensureDatasetSeeded() {
  const count = await prisma.scheme.count();
  if (count === 0) {
    console.log('[MoTA API] Database empty. Populating database with official MoTA scheme dataset...');
    for (const item of officialSchemesDataset) {
      const scheme = await prisma.scheme.create({
        data: {
          code: item.code,
          name: item.name,
          description: item.description,
          portalType: item.portalType,
          applicationWindowStart: item.applicationWindowStart,
          applicationWindowEnd: item.applicationWindowEnd,
          isActive: true,
          budgetAllocation: item.budgetAllocation,
          budgetUtilized: item.budgetUtilized,
          totalSeats: item.totalSeats,
        },
      });

      await prisma.schemeConfig.create({
        data: {
          schemeId: scheme.id,
          version: 1,
          isActive: true,
          eligibilityRulesJson: JSON.stringify(item.eligibilityRules),
          requiredDocumentsJson: JSON.stringify(item.requiredDocuments),
          scoringWeightageJson: JSON.stringify(item.scoringWeightage),
          tieBreakerRulesJson: JSON.stringify(item.tieBreakerRules),
        },
      });
    }
  }
}

// List Schemes directly from Database
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    await ensureDatasetSeeded();

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

    return res.json({ schemes: parsed, source: 'DATABASE' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Sync / Reset Official Dataset into Database
router.post('/sync-dataset', async (req: AuthRequest, res: Response) => {
  try {
    console.log('[MoTA API] Manual dataset sync requested. Updating database...');
    for (const item of officialSchemesDataset) {
      const existing = await prisma.scheme.findUnique({ where: { code: item.code } });
      if (!existing) {
        const scheme = await prisma.scheme.create({
          data: {
            code: item.code,
            name: item.name,
            description: item.description,
            portalType: item.portalType,
            applicationWindowStart: item.applicationWindowStart,
            applicationWindowEnd: item.applicationWindowEnd,
            isActive: true,
            budgetAllocation: item.budgetAllocation,
            budgetUtilized: item.budgetUtilized,
            totalSeats: item.totalSeats,
          },
        });

        await prisma.schemeConfig.create({
          data: {
            schemeId: scheme.id,
            version: 1,
            isActive: true,
            eligibilityRulesJson: JSON.stringify(item.eligibilityRules),
            requiredDocumentsJson: JSON.stringify(item.requiredDocuments),
            scoringWeightageJson: JSON.stringify(item.scoringWeightage),
            tieBreakerRulesJson: JSON.stringify(item.tieBreakerRules),
          },
        });
      }
    }

    const updatedSchemes = await prisma.scheme.findMany({
      include: {
        configs: {
          where: { isActive: true },
          take: 1,
        },
      },
    });

    return res.json({ message: 'Database successfully synced with official MoTA dataset', count: updatedSchemes.length });
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
          applicationWindowEnd: new Date(Date.now() + 90 * 86400 * 1000),
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

import { Router, Request, Response } from 'express';
import { prisma } from '../services/db.js';
import { GeminiService } from '../services/geminiService.js';

const router = Router();

/**
 * Feature 3: Natural Language Admin Search Endpoint
 * POST /api/admin/query (also mounted under /api/v1/admin/query)
 * Accepts free-text question from admin (e.g. "show Post-Matric applicants from Uttar Pradesh pending verification for more than 15 days")
 * Uses Gemini to translate to structured JSON filter, sanitizes against allow-list, runs query against DB.
 * Returns matching records or fallback "couldn't parse that query".
 */
router.post('/query', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "couldn't parse that query",
        filter: null,
        results: [],
      });
    }

    // 1. Translate free-text question to sanitized filter object
    const parsed = await GeminiService.parseNaturalAdminQuery(query.trim());

    if (parsed.error || !parsed.filter) {
      return res.json({
        success: false,
        message: "couldn't parse that query",
        filter: null,
        results: [],
      });
    }

    const { schemeCode, state, status, riskLevel, maxIncome, submittedDaysAgo } = parsed.filter;

    // 2. Build secure Prisma query object matching sanitized allow-list fields only
    const whereClause: any = {};

    if (schemeCode) {
      whereClause.scheme = { code: schemeCode };
    }

    if (state) {
      whereClause.user = { state: { contains: state } };
    }

    if (status) {
      whereClause.status = status;
    }

    if (riskLevel) {
      whereClause.riskLevel = riskLevel;
    }

    if (submittedDaysAgo) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - submittedDaysAgo);
      whereClause.submittedAt = { lte: targetDate };
    }

    // 3. Run safe query against DB
    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        scheme: { select: { code: true, name: true } },
        user: { select: { fullName: true, email: true, state: true, district: true, category: true } },
        documents: { select: { id: true, type: true, verificationStatus: true, ocrConfidenceScore: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });

    // Post-filter by income if needed (formData is JSON string)
    let filteredResults = applications.map((app) => {
      const formData = JSON.parse(app.formDataJson || '{}');
      return {
        ...app,
        formData,
      };
    });

    if (maxIncome !== undefined) {
      filteredResults = filteredResults.filter(
        (app) => (app.formData.annualIncome ? Number(app.formData.annualIncome) : 0) <= maxIncome
      );
    }

    return res.json({
      success: true,
      message: `Found ${filteredResults.length} records matching your query`,
      filter: parsed.filter,
      resultsCount: filteredResults.length,
      applications: filteredResults,
    });
  } catch (err: any) {
    console.error('[Admin Query Endpoint Error]:', err);
    return res.status(200).json({
      success: false,
      message: "couldn't parse that query",
      filter: null,
      results: [],
    });
  }
});

export default router;

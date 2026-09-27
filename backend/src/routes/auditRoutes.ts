import { Router, Response } from 'express';
import { prisma } from '../services/db.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();

// Searchable Audit Trail Logs
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { applicationId, actorId, action, search } = req.query;

    const where: any = {};
    if (applicationId) where.applicationId = String(applicationId);
    if (actorId) where.actorId = String(actorId);
    if (action) where.action = String(action);

    if (search) {
      where.OR = [
        { action: { contains: String(search) } },
        { reason: { contains: String(search) } },
        { application: { applicationNo: { contains: String(search) } } },
        { actor: { fullName: { contains: String(search) } } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        application: { select: { applicationNo: true, scheme: { select: { code: true, name: true } } } },
        actor: { select: { fullName: true, email: true, role: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    const parsed = logs.map((l) => ({
      ...l,
      metadata: l.metadataJson ? JSON.parse(l.metadataJson) : null,
    }));

    return res.json({ auditLogs: parsed });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

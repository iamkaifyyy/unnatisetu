import { Router, Response } from 'express';
import { prisma } from '../services/db.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get user notifications
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { sentAt: 'desc' },
      take: 50,
    });
    return res.json({ notifications });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
router.post('/:id/read', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

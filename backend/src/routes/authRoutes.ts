import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/db.js';
import { AuthRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sih_2026_mota_tribal_affairs_secret_key_jwt_super_secure';

// Register User
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, fullName, role = 'APPLICANT', state = 'Jharkhand', phone, category = 'ST' } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role,
        state,
        phone,
        category,
        aadhaarNumber: 'XXXX-XXXX-8921',
        digilockerId: `DIGI-${Math.floor(100000 + Math.random() * 900000)}`,
        profileComplete: 85,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, fullName: user.fullName, state: user.state },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        state: user.state,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Login User
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, fullName: user.fullName, state: user.state },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        state: user.state,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Quick Switcher / Seed Demo Login helper for hackathon live demo!
router.post('/seed-login', async (req: AuthRequest, res: Response) => {
  try {
    const { role = 'APPLICANT' } = req.body;

    let user = await prisma.user.findFirst({ where: { role } });
    if (!user) {
      // Fallback first user
      user = await prisma.user.findFirst();
    }

    if (!user) {
      return res.status(404).json({ error: 'No user found for role. Please seed database.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, fullName: user.fullName, state: user.state },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        state: user.state,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get Current User Profile
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        state: true,
        district: true,
        category: true,
        pvtgGroup: true,
        aadhaarNumber: true,
        digilockerId: true,
        profileComplete: true,
        createdAt: true,
      },
    });
    return res.json({ user });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

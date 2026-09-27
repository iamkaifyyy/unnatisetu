import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'APPLICANT' | 'VERIFIER' | 'STATE_ADMIN' | 'MINISTRY_ADMIN';
  fullName: string;
  state?: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const secret = process.env.JWT_SECRET || 'sih_2026_mota_tribal_affairs_secret_key_jwt_super_secure';

  jwt.verify(token, secret, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired access token' });
    }
    req.user = user as AuthenticatedUser;
    next();
  });
};

export const requireRoles = (roles: Array<'APPLICANT' | 'VERIFIER' | 'STATE_ADMIN' | 'MINISTRY_ADMIN'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Unauthorized role '${req.user.role}'. Required one of: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { AdminUser } from '../src/types/portfolio';

const JWT_SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'akash-portfolio-jwt-secret-key-2026';
const TOKEN_COOKIE_NAME = 'akash_admin_token';

// Simple in-memory rate limiting map for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const rateLimitLogin = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lastAttempt: now };

  // Reset after 10 minutes
  if (now - record.lastAttempt > 10 * 60 * 1000) {
    record.count = 0;
    record.lastAttempt = now;
  }

  if (record.count >= 10) {
    return res.status(429).json({
      success: false,
      error: 'Too many failed login attempts. Please wait 10 minutes before trying again.',
    });
  }

  loginAttempts.set(ip, record);
  next();
};

export const recordFailedLogin = (ip: string) => {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lastAttempt: now };
  record.count += 1;
  record.lastAttempt = now;
  loginAttempts.set(ip, record);
};

export const clearLoginAttempts = (ip: string) => {
  loginAttempts.delete(ip);
};

export interface AuthenticatedRequest extends Request {
  user?: AdminUser;
}

export const signToken = (user: AdminUser): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.[TOKEN_COOKIE_NAME];

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Authentication token is missing.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    const admin = db.getAdminById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. User account not found or has been revoked.',
      });
    }

    req.user = admin;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session. Please log in again.',
    });
  }
};

export const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

import { Router, Request, Response } from 'express';
import { db } from '../db';
import {
  signToken,
  setAuthCookie,
  clearAuthCookie,
  requireAdmin,
  hashPassword,
  verifyPassword,
  rateLimitLogin,
  recordFailedLogin,
  clearLoginAttempts,
  AuthenticatedRequest,
} from '../auth';

const router = Router();

// POST /api/auth/login
router.post('/login', rateLimitLogin, (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required.',
    });
  }

  const admin = db.getAdminByEmail(email.trim());

  if (!admin) {
    recordFailedLogin(ip);
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password credentials.',
    });
  }

  const isMatch = verifyPassword(password, admin.passwordHash);
  if (!isMatch) {
    recordFailedLogin(ip);
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password credentials.',
    });
  }

  clearLoginAttempts(ip);
  db.updateAdminLastLogin(admin.id);
  db.logActivity('Admin Login', `User ${admin.email}`, ip);

  const token = signToken(admin);
  setAuthCookie(res, token);

  return res.json({
    success: true,
    token, // Return token as well for bearer support
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      lastLogin: admin.lastLogin,
    },
  });
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  clearAuthCookie(res);
  return res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// GET /api/auth/me
router.get('/me', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }

  return res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      lastLogin: req.user.lastLogin,
    },
  });
});

// POST /api/auth/change-password
router.post('/change-password', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Current password and new password are required.',
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      error: 'New password must be at least 8 characters long.',
    });
  }

  const admin = db.getAdminById(req.user!.id);
  if (!admin) {
    return res.status(404).json({ success: false, error: 'Admin account not found.' });
  }

  const isCurrentValid = verifyPassword(currentPassword, admin.passwordHash);
  if (!isCurrentValid) {
    return res.status(400).json({
      success: false,
      error: 'Current password is incorrect.',
    });
  }

  const newHash = hashPassword(newPassword);
  db.updateAdminPassword(admin.id, newHash);
  db.logActivity('Password Changed', `User ${admin.email}`, req.ip);

  return res.json({
    success: true,
    message: 'Password changed successfully.',
  });
});

export default router;

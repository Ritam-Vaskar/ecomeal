import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../shared/asyncHandler.js';
import { AppError } from '../../shared/errors.js';
import { requireAuth } from './middleware.js';
import {
  comparePassword,
  createUser,
  findUserByEmail,
  persistRefreshToken,
  rotateRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from './service.js';

const router = Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'manager', 'staff']).default('manager'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const data = signupSchema.parse(req.body);
    const user = await createUser(data);
    const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id.toString(), role: user.role });
    await persistRefreshToken(user._id.toString(), refreshToken);
    res.status(201).json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const user = await findUserByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    const ok = await comparePassword(data.password, user.passwordHash);
    if (!ok) {
      throw new AppError('Invalid credentials', 401);
    }
    const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id.toString(), role: user.role });
    await persistRefreshToken(user._id.toString(), refreshToken);
    res.json({
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  }),
);

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const data = refreshSchema.parse(req.body);
    const payload = verifyRefreshToken(data.refreshToken);
    const user = await rotateRefreshToken(payload.sub, data.refreshToken);
    const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id.toString(), role: user.role });
    await persistRefreshToken(user._id.toString(), refreshToken);
    res.json({ accessToken, refreshToken });
  }),
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({
      user: req.user,
    });
  }),
);

export default router;

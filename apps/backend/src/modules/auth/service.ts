import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AppError } from '../../shared/errors.js';
import { isMongoConnected } from '../../shared/db.js';
import { UserModel } from './model.js';

const jwtSchema = z.object({
  sub: z.string(),
  role: z.enum(['admin', 'manager', 'staff']),
});

const tokenTtl = '1h';
const refreshTtl = '14d';

function getSecret(name: 'JWT_SECRET' | 'JWT_REFRESH_SECRET') {
  const value = process.env[name];
  if (!value) {
    throw new AppError(`${name} is not configured`, 500);
  }
  return value;
}

export function signAccessToken(payload: { sub: string; role: string }) {
  return jwt.sign(payload, getSecret('JWT_SECRET'), { expiresIn: tokenTtl });
}

export function signRefreshToken(payload: { sub: string; role: string }) {
  return jwt.sign(payload, getSecret('JWT_REFRESH_SECRET'), { expiresIn: refreshTtl });
}

export function verifyToken(token: string) {
  const decoded = jwt.verify(token, getSecret('JWT_SECRET'));
  return jwtSchema.parse(decoded);
}

export function verifyRefreshToken(token: string) {
  const decoded = jwt.verify(token, getSecret('JWT_REFRESH_SECRET'));
  return jwtSchema.parse(decoded);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function findUserByEmail(email: string) {
  if (!isMongoConnected()) return null;
  return UserModel.findOne({ email }).lean();
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'staff';
}) {
  if (!isMongoConnected()) {
    throw new AppError('Database not available', 503);
  }

  const existing = await UserModel.findOne({ email: input.email });
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  const passwordHash = await hashPassword(input.password);
  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: input.role,
  });

  return user;
}

export async function persistRefreshToken(userId: string, token: string) {
  if (!isMongoConnected()) return;
  await UserModel.updateOne({ _id: userId }, { refreshToken: token });
}

export async function rotateRefreshToken(userId: string, oldToken: string) {
  if (!isMongoConnected()) {
    throw new AppError('Database not available', 503);
  }

  const user = await UserModel.findById(userId);
  if (!user || user.refreshToken !== oldToken) {
    throw new AppError('Invalid refresh token', 401);
  }

  return user;
}

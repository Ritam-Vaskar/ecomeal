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
function getSecret(name) {
    const value = process.env[name];
    if (!value) {
        throw new AppError(`${name} is not configured`, 500);
    }
    return value;
}
export function signAccessToken(payload) {
    return jwt.sign(payload, getSecret('JWT_SECRET'), { expiresIn: tokenTtl });
}
export function signRefreshToken(payload) {
    return jwt.sign(payload, getSecret('JWT_REFRESH_SECRET'), { expiresIn: refreshTtl });
}
export function verifyToken(token) {
    const decoded = jwt.verify(token, getSecret('JWT_SECRET'));
    return jwtSchema.parse(decoded);
}
export function verifyRefreshToken(token) {
    const decoded = jwt.verify(token, getSecret('JWT_REFRESH_SECRET'));
    return jwtSchema.parse(decoded);
}
export async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}
export async function comparePassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}
export async function findUserByEmail(email) {
    if (!isMongoConnected())
        return null;
    return UserModel.findOne({ email });
}
export async function createUser(input) {
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
export async function persistRefreshToken(userId, token) {
    if (!isMongoConnected())
        return;
    await UserModel.updateOne({ _id: userId }, { refreshToken: token });
}
export async function rotateRefreshToken(userId, oldToken) {
    if (!isMongoConnected()) {
        throw new AppError('Database not available', 503);
    }
    const user = await UserModel.findById(userId);
    if (!user || user.refreshToken !== oldToken) {
        throw new AppError('Invalid refresh token', 401);
    }
    return user;
}

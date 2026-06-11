import { AppError } from '../../shared/errors.js';
import { verifyToken } from './service.js';
export function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return next(new AppError('Missing authorization', 401));
    }
    try {
        const token = header.replace('Bearer ', '').trim();
        const payload = verifyToken(token);
        req.user = { id: payload.sub, role: payload.role };
        return next();
    }
    catch (error) {
        return next(new AppError('Invalid token', 401));
    }
}
export function requireRole(roles) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new AppError('Unauthorized', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Forbidden', 403));
        }
        return next();
    };
}

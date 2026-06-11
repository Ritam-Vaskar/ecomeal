import { ZodError } from 'zod';
export class AppError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}
export function errorHandler(err, _req, res, _next) {
    if (err instanceof ZodError) {
        res.status(400).json({
            error: 'Invalid request',
            details: err.errors,
        });
        return;
    }
    const status = err instanceof AppError ? err.status : 500;
    res.status(status).json({
        error: err.message || 'Unexpected server error',
    });
}

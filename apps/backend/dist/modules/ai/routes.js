import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../auth/middleware.js';
import { enqueueJob, getJob, registerHandler } from '../queue/manager.js';
import { generateRecommendations, getAiResult, setAiResult } from './service.js';
const router = Router();
const requestSchema = z.object({
    ingredients: z.array(z.string().min(1)).min(1),
    unstable: z.boolean().optional(),
});
registerHandler('ai:recommendations', async (payload) => {
    const result = generateRecommendations(payload.ingredients);
    setAiResult(payload.jobId, result);
});
router.post('/recommendations', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
    const data = requestSchema.parse(req.body);
    const simulateFailure = data.unstable ?? false;
    if (simulateFailure && Math.random() < 0.6) {
        const job = enqueueJob('ai:recommendations', {
            jobId: 'ai_' + Date.now(),
            ingredients: data.ingredients,
        });
        res.status(202).json({ status: 'queued', jobId: job.id });
        return;
    }
    const result = generateRecommendations(data.ingredients);
    res.json({ status: 'ok', ...result });
});
router.get('/jobs/:id', requireAuth, requireRole(['admin', 'manager']), (req, res) => {
    const job = getJob(req.params.id);
    if (!job) {
        res.status(404).json({ error: 'Job not found' });
        return;
    }
    const result = getAiResult(job.payload?.jobId ?? '');
    res.json({
        id: job.id,
        status: job.status,
        attempts: job.attempts,
        lastError: job.lastError,
        result,
    });
});
export default router;

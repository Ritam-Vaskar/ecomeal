import { Router } from 'express';
import { requireAuth, requireRole } from '../auth/middleware.js';
const router = Router();
router.get('/', requireAuth, requireRole(['admin', 'manager']), (_req, res) => {
    res.json({
        wasteTrend: [12, 9, 8, 11, 7],
        expiryRisk: [5, 8, 3, 6, 4],
        lowStock: 6,
    });
});
export default router;

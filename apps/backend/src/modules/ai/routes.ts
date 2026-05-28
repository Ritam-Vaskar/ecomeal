import { Router } from 'express';
import { requireAuth, requireRole } from '../auth/middleware.js';

const router = Router();

router.post('/recommendations', requireAuth, requireRole(['admin', 'manager']), (_req, res) => {
  res.json({
    specials: [
      {
        title: 'Forest Mushroom Risotto',
        description: 'Use mushrooms, spinach, parmesan, and veg stock.',
        ingredients: ['Mushroom', 'Spinach', 'Parmesan'],
        priority: 'High',
      },
    ],
    priority: ['Mushroom', 'Paneer', 'Tomato'],
  });
});

export default router;

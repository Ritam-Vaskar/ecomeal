import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../shared/asyncHandler.js';
import { createInventoryItem, listInventoryItems } from './repo.js';
import { requireAuth, requireRole } from '../auth/middleware.js';
import { getIo } from '../realtime/socket.js';

const router = Router();

const inventorySchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  expiryDate: z.string().min(1),
  supplier: z.string().min(1),
  minStock: z.number().nonnegative().optional(),
  location: z.string().optional(),
  costPerUnit: z.number().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
});

const listSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(25),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  expiryBefore: z.string().optional(),
  sort: z.string().optional(),
});

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const params = listSchema.parse(req.query);
    const result = await listInventoryItems(params);
    res.json(result);
  }),
);

router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'manager']),
  asyncHandler(async (req, res) => {
    const data = inventorySchema.parse(req.body);
    const item = await createInventoryItem({
      id: '',
      status: 'warning',
      minStock: 0,
      tags: [],
      ...data,
    });
    const io = getIo();
    io?.emit('inventory:update', { type: 'created', item });
    res.status(201).json({ item });
  }),
);

export default router;

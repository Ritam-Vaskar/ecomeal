import 'dotenv/config';
import cors from 'cors';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
import authRoutes from './modules/auth/routes.js';
import inventoryRoutes from './modules/inventory/routes.js';
import aiRoutes from './modules/ai/routes.js';
import analyticsRoutes from './modules/analytics/routes.js';
import { AppError, errorHandler } from './shared/errors.js';
import { initSocket } from './modules/realtime/socket.js';
import { connectMongo } from './shared/db.js';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use((req, res, next) => {
  const requestId = randomUUID();
  res.setHeader('x-request-id', requestId);
  (req as typeof req & { requestId: string }).requestId = requestId;
  res.setTimeout(10000, () => {
    res.status(503).json({ error: 'Request timeout', requestId });
  });
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/ai', aiRoutes);
app.use('/analytics', analyticsRoutes);

app.use((_req, _res, next) => {
  next(new AppError('Route not found', 404));
});

app.use(errorHandler);

connectMongo().then((connected) => {
  if (!connected) {
    // eslint-disable-next-line no-console
    console.warn('MongoDB not connected, using in-memory fallback.');
  }
});

initSocket(server);

const port = Number(process.env.PORT || 4000);
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Ecomeal backend listening on ${port}`);
});

# Ecomeal

AI-powered restaurant inventory and kitchen intelligence platform.

## Current Architecture
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS + PWA shell.
- Backend: Express + TypeScript with modular routes.
- Database: MongoDB Atlas with indexed inventory schema and pagination.
- Realtime: Socket.IO for inventory updates.
- Offline-first: Local queue + service worker background sync.
- Queue handling: In-memory retry manager for AI jobs (upgradeable to Redis).

## Features Implemented
- Auth: JWT + refresh tokens + role-based access.
- Inventory: pagination, search, filters, offline queue, realtime updates.
- AI: queue-backed retries + job polling.
- Analytics: live dashboard pulling metrics from API.
- Failure handling: rate limiting, timeouts, request IDs, retries on GET.

## Backend Endpoints
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`
- `GET /inventory`
- `POST /inventory`
- `POST /ai/recommendations`
- `GET /ai/jobs/:id`
- `GET /analytics`
- `GET /health`

## Offline Sync Strategy
- Inventory writes are queued in local storage when offline.
- Service worker registers background sync and signals the UI to flush.
- Queue flush retries are capped and safe.

## Queue Handling Strategy
- AI requests can simulate unstable upstream responses.
- Failed requests enqueue jobs with backoff and retry tracking.
- Jobs can be polled via `/ai/jobs/:id`.

## Performance Notes
- Memoized inventory table rendering.
- Deferred search input to reduce fetch churn.
- Response compression enabled on backend.

## Tradeoffs
- AI is simulated locally (no external API keys wired yet).
- Queue manager is in-memory (swap to Redis/BullMQ later).

## Setup
1) Create env files from the examples in apps/frontend and apps/backend.
2) Install dependencies:
	- `cd apps/frontend && npm install`
	- `cd apps/backend && npm install`
3) Run dev servers:
	- Frontend: `npm run dev` (from apps/frontend)
	- Backend: `npm run dev` (from apps/backend)

## Environment Variables
Frontend (apps/frontend/.env):
- `NEXT_PUBLIC_API_URL=http://localhost:4000`
- `NEXT_PUBLIC_WS_URL=http://localhost:4000`

Backend (apps/backend/.env):
- `PORT=4000`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `JWT_REFRESH_SECRET=...`
- `GEMINI_API_KEY=...` (optional, not wired yet)
- `GROK_API_KEY=...` (optional, not wired yet)

## Future Improvements
- Redis-backed queues and BullMQ.
- Full PWA offline caching with IndexedDB.
- Multi-tenant org and audit logs.


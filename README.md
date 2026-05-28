# Ecomeal

AI-powered restaurant inventory and kitchen intelligence platform.

## Phase Plan
1. Foundation: monorepo scaffolding, core UI shell, API skeleton, env setup.
2. Data layer: MongoDB schema, inventory CRUD, pagination, indexing.
3. Auth: JWT + refresh tokens, role-based access, protected routes.
4. Offline-first: IndexedDB queue, sync worker, conflict resolution.
5. Real-time: Socket.IO updates, low-stock and expiry alerts.
6. AI engine: Gemini + Grok integration with fallback and caching.
7. Analytics: dashboards with trends and efficiency metrics.
8. Resilience: retry queues, circuit breakers, failure handling.
9. Performance: virtualization, query tuning, bundle reduction.

## Architecture Decisions
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, PWA.
- Backend: Express + TypeScript with modular route structure.
- Database: MongoDB Atlas with indexes and pagination.
- Realtime: Socket.IO.
- Offline: IndexedDB + service worker background sync.
- Queues: BullMQ with Redis for retries and burst handling.

## Frontend Structure
- App routes grouped by auth and dashboard.
- Shared UI components and hooks.
- Offline queue + sync utilities.

## Backend Architecture
- Feature modules for auth, inventory, analytics, AI, realtime, queues.
- Central error handler and validation with Zod.

## Database Design
- Inventory items with supplier, expiry, and stock metadata.
- Indexes on expiry date, category, and low-stock thresholds.

## Offline Sync Strategy
- Queue write operations in IndexedDB.
- Sync on reconnect with conflict resolution and retries.

## Queue Handling Strategy
- BullMQ for background jobs and retry logic.
- Dead-letter queue for persistent failures.

## AI Integration Logic
- Gemini primary, Grok secondary fallback.
- Prompt templates based on expiring ingredients.

## Performance Optimizations
- List virtualization for large inventories.
- Server-side pagination and indexed queries.
- Memoized UI components and minimal re-renders.

## Tradeoffs
- Start with in-memory fallbacks while DB setup is pending.
- Staged rollout of PWA features to avoid dev friction.

## Future Improvements
- Fine-grained audit logs.
- Forecasting models for usage trends.
- Multi-tenant org support.

## Setup
- Create env files from the examples in apps/frontend and apps/backend.
- Install dependencies in both apps.
- Run frontend and backend dev servers.


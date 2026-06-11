import { randomUUID } from 'crypto';
const handlers = new Map();
const jobs = new Map();
export function registerHandler(name, handler) {
    handlers.set(name, handler);
}
export function getJob(id) {
    return jobs.get(id) ?? null;
}
export function enqueueJob(name, payload, options) {
    const job = {
        id: randomUUID(),
        name,
        payload,
        attempts: 0,
        maxAttempts: options?.maxAttempts ?? 5,
        backoffMs: options?.backoffMs ?? 2000,
        status: 'queued',
    };
    jobs.set(job.id, job);
    schedule(job);
    return job;
}
function schedule(job) {
    setTimeout(() => {
        void process(job.id);
    }, job.backoffMs * Math.max(1, job.attempts + 1));
}
async function process(jobId) {
    const job = jobs.get(jobId);
    if (!job)
        return;
    const handler = handlers.get(job.name);
    if (!handler) {
        job.status = 'failed';
        job.lastError = 'No handler registered';
        return;
    }
    job.status = 'processing';
    try {
        await handler(job.payload);
        job.status = 'completed';
    }
    catch (error) {
        job.attempts += 1;
        job.lastError = error instanceof Error ? error.message : 'Unknown error';
        if (job.attempts >= job.maxAttempts) {
            job.status = 'failed';
            return;
        }
        job.status = 'queued';
        schedule(job);
    }
}

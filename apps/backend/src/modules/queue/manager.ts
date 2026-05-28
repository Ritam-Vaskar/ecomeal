import { randomUUID } from 'crypto';

export type QueueJob<T> = {
  id: string;
  name: string;
  payload: T;
  attempts: number;
  maxAttempts: number;
  backoffMs: number;
  status: 'queued' | 'processing' | 'failed' | 'completed';
  lastError?: string;
};

type Handler<T> = (payload: T) => Promise<void>;

const handlers = new Map<string, Handler<any>>();
const jobs = new Map<string, QueueJob<any>>();

export function registerHandler<T>(name: string, handler: Handler<T>) {
  handlers.set(name, handler);
}

export function getJob(id: string) {
  return jobs.get(id) ?? null;
}

export function enqueueJob<T>(
  name: string,
  payload: T,
  options?: { maxAttempts?: number; backoffMs?: number },
) {
  const job: QueueJob<T> = {
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

function schedule(job: QueueJob<any>) {
  setTimeout(() => {
    void process(job.id);
  }, job.backoffMs * Math.max(1, job.attempts + 1));
}

async function process(jobId: string) {
  const job = jobs.get(jobId);
  if (!job) return;
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
  } catch (error) {
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

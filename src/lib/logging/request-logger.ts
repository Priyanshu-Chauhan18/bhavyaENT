/**
 * Structured request logger for observability.
 * 
 * Outputs machine-parseable JSON logs for Vercel / log aggregators.
 * Intentionally simple — no tracing, no spans, no external pipelines.
 */

type RequestLogEntry = {
  requestId: string;
  route: string;
  method: string;
  statusCode: number;
  latencyMs: number;
  userId?: string;
  cacheStatus?: 'hit' | 'miss' | 'skip';
};

export function logRequest(entry: RequestLogEntry): void {
  const log = {
    level: entry.statusCode >= 500 ? 'error' : entry.statusCode >= 400 ? 'warn' : 'info',
    timestamp: new Date().toISOString(),
    ...entry,
  };

  // Structured JSON — Vercel and most aggregators parse this automatically
  if (entry.statusCode >= 500) {
    console.error('SERVER_ERROR', JSON.stringify(log));
  } else {
    console.log(JSON.stringify(log));
  }
}

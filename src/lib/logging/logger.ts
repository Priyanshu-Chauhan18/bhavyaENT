/**
 * Structured logger.
 * 
 * Log shape:
 * {
 *   level: "info" | "warn" | "error",
 *   message: string,
 *   timestamp: string (ISO 8601),
 *   requestId?: string,
 *   ...meta
 * }
 * 
 * Does NOT log secrets or raw sensitive payloads.
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogMeta {
  requestId?: string;
  [key: string]: unknown;
}

function formatEntry(level: LogLevel, message: string, meta?: LogMeta) {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta?.requestId && { requestId: meta.requestId }),
    ...meta,
  };
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    console.log(JSON.stringify(formatEntry('info', message, meta)));
  },

  warn(message: string, meta?: LogMeta) {
    console.warn(JSON.stringify(formatEntry('warn', message, meta)));
  },

  error(message: string, meta?: LogMeta) {
    console.error(JSON.stringify(formatEntry('error', message, meta)));
  },
};

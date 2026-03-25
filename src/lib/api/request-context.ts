/**
 * Request ID generation for tracing.
 * Generates a lightweight unique ID for each request/action.
 * Pattern: req_<random>
 */

let counter = 0;

export function generateRequestId(): string {
  counter = (counter + 1) % 1_000_000;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `req_${timestamp}_${random}_${counter}`;
}

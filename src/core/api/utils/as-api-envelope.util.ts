import type { ApiEnvelope } from '../interfaces/api-envelope.interface';

export function asApiEnvelope(value: unknown): ApiEnvelope {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return value as ApiEnvelope;
}

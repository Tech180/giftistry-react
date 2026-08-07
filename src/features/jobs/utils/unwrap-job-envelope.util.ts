/**
 * Expects an apiClient-unwrapped `Result` payload with PascalCase keys.
 * Peels a rare nested `Data` wrap; does not peel `Result` again (apiClient already did).
 */
export function unwrapJobEnvelope<T>(raw: unknown): T {
  if (!raw || typeof raw !== 'object') {
    return {} as T;
  }

  const record = raw as Record<string, unknown>;
  if ('Job' in record) {
    return raw as T;
  }

  const nested = record.Data;
  if (nested && typeof nested === 'object') {
    return unwrapJobEnvelope<T>(nested);
  }

  return raw as T;
}

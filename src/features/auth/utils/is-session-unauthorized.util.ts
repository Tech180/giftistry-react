import { SESSION_UNAUTHORIZED_MESSAGE_PREFIXES } from '../constants/session-unauthorized-message-prefixes.constant';

function readApiErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  const record = payload as Record<string, unknown>;
  const result = record.Result;
  if (result && typeof result === 'object') {
    const nested = (result as Record<string, unknown>).Message;
    if (typeof nested === 'string') {
      return nested;
    }
  }

  return typeof record.Message === 'string' ? record.Message : '';
}

/** True only for dead/missing sessions — not invite-password or login 401s. */
export function isSessionUnauthorized(status: number, payload: unknown): boolean {
  if (status !== 401) {
    return false;
  }

  const message = readApiErrorMessage(payload);
  return SESSION_UNAUTHORIZED_MESSAGE_PREFIXES.some((prefix) => message.startsWith(prefix));
}

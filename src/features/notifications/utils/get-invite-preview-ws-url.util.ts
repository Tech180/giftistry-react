import { env } from 'core/config/env';

/** Guest invite preview WebSocket — token is the capability (no JWT). */
export function getInvitePreviewWsUrl(token: string): string {
  const apiBaseUrl = env.apiUrl;
  let protocol = 'ws:';
  let host = 'localhost:3001';

  if (apiBaseUrl.startsWith('http')) {
    protocol = apiBaseUrl.startsWith('https') ? 'wss:' : 'ws:';
    host = apiBaseUrl.replace(/^https?:\/\//, '');
  } else {
    protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    host = window.location.host;
  }

  return `${protocol}//${host}/ws/invite/${encodeURIComponent(token)}`;
}

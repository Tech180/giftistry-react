import { AUTH_TOKEN_STORAGE_KEY } from 'core/api/constants/token-storage-key.constant';
import { env } from 'core/config/env';

export function getUserWsUrl(): string {
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

  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '';
  return `${protocol}//${host}/ws/user?token=${encodeURIComponent(token)}`;
}

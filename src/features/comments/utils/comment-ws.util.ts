import { env } from 'core/config/env';

export function getCommentWsUrl(listId: string): string {
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

  const token = localStorage.getItem('giftistry-token') || '';
  return `${protocol}//${host}/ws/wishlist/${listId}?token=${encodeURIComponent(token)}`;
}

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

  const token = localStorage.getItem('giftistry-token') || '';
  return `${protocol}//${host}/ws/user?token=${encodeURIComponent(token)}`;
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'app/App';
import { env } from 'core/config/env';
import { loadStylesheet } from './load-stylesheet';

const BOOTSTRAP_TIMEOUT_MS = 5000;

export async function bootstrapApp(): Promise<void> {
  const savedTheme = localStorage.getItem('giftistry-theme') || 'default';
  const savedAppearance = localStorage.getItem('giftistry-appearance') || 'system';
  const effectiveTheme = savedTheme.startsWith('custom-') ? 'default' : savedTheme;
  const effectiveAppearance = savedAppearance === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : savedAppearance;

  document.documentElement.setAttribute('data-theme', effectiveTheme);
  document.documentElement.setAttribute('data-appearance', effectiveAppearance);

  const coreUrl = `${env.apiUrl}/api/themes/core/css`;
  const themeUrl = `${env.apiUrl}/api/themes/${effectiveTheme}/${effectiveAppearance}/css`;

  try {
    await Promise.race([
      Promise.all([
        loadStylesheet('core-theme-stylesheet', coreUrl),
        loadStylesheet('theme-stylesheet', themeUrl),
      ]),
      new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error('CSS bootstrap timed out')), BOOTSTRAP_TIMEOUT_MS)
      ),
    ]);
  } catch (error) {
    console.error('CSS bootstrapper:', error);
  }

  const container = document.getElementById('root');
  if (!container) throw new Error('Failed to find the root element');

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

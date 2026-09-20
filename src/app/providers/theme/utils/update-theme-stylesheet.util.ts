import { env } from 'core/config/env';
import type { ThemeStylesheetResult } from '../interfaces/stylesheet-result.interface';

let lastRequestedUrl = '';

/**
 * Loads the theme stylesheet in the background and swaps it into the DOM once loaded.
 * Callers should update data-theme / data-appearance only after a successful load,
 * otherwise selectors stop matching while the previous stylesheet is still active
 * (blank/white screen).
 */
export function updateThemeStylesheet(theme: string, appearance: string): Promise<ThemeStylesheetResult> {
  return new Promise((resolve) => {
    const url = `${env.apiUrl}/api/themes/${theme}/${appearance}/css`;
    lastRequestedUrl = url;

    const activeLink = document.getElementById('theme-stylesheet') as HTMLLinkElement | null;
    if (activeLink && activeLink.href === url) {
      resolve({ ok: true, url });
      return;
    }

    const newLink = document.createElement('link');
    newLink.rel = 'stylesheet';
    newLink.href = url;
    newLink.setAttribute('data-theme-style', 'pending');

    const finish = (ok: boolean) => {
      if (lastRequestedUrl !== url) {
        if (newLink.parentNode) {
          newLink.parentNode.removeChild(newLink);
        }
        resolve({ ok: false, url });
        return;
      }

      if (!ok) {
        console.error(`Failed to load theme stylesheet from: ${url}`);
        if (newLink.parentNode) {
          newLink.parentNode.removeChild(newLink);
        }
        resolve({ ok: false, url });
        return;
      }

      const oldLink = document.getElementById('theme-stylesheet');
      newLink.id = 'theme-stylesheet';
      newLink.removeAttribute('data-theme-style');

      if (oldLink && oldLink !== newLink) {
        oldLink.parentNode?.removeChild(oldLink);
      }

      resolve({ ok: true, url });
    };

    newLink.onload = () => finish(true);
    newLink.onerror = () => finish(false);

    // First paint: promote immediately so tests / early consumers can find the link.
    // Subsequent swaps stay pending until load succeeds so the prior theme keeps matching.
    if (!activeLink) {
      newLink.id = 'theme-stylesheet';
      newLink.removeAttribute('data-theme-style');
    }

    document.head.appendChild(newLink);
  });
}

/** Injects a stylesheet link and resolves when the browser finishes parsing it. */
export function loadStylesheet(id: string, url: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.id = id;
    link.href = url;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Stylesheet failed to load: ${url}`));
    document.head.appendChild(link);
  });
}

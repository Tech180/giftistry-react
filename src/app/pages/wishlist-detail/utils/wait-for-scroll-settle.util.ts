/**
 * Resolves when scrolling settles (`scrollend`) or after `fallbackMs`.
 * If no scroll occurs, resolves on the next frame so peeks stay snappy.
 */
export function waitForScrollSettle(fallbackMs: number): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    let sawScroll = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(fallbackId);
      window.clearTimeout(idleId);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('scrollend', onScrollEnd, true);
      resolve();
    };

    const onScroll = () => {
      sawScroll = true;
    };

    const onScrollEnd = () => {
      finish();
    };

    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('scrollend', onScrollEnd, true);

    const fallbackId = window.setTimeout(finish, Math.max(0, fallbackMs));

    // If nothing scrolls shortly after scrollIntoView, don't wait the full fallback.
    const idleId = window.setTimeout(() => {
      if (!sawScroll) {
        finish();
      }
    }, 100);
  });
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, Math.max(0, ms));
  });
}

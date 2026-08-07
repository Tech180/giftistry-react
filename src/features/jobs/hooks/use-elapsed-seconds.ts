import { useEffect, useState } from 'react';

/**
 * Ticks whole seconds while `active` is true.
 * Resets to 0 when inactive. Uses `anchorMs` (epoch ms) when provided,
 * otherwise starts from mount/activation time.
 */
export function useElapsedSeconds(
  active: boolean,
  anchorMs?: number | null
): number {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active) {
      setElapsed(0);
      return;
    }

    const startedAt = anchorMs && Number.isFinite(anchorMs) ? anchorMs : Date.now();
    const tick = () => {
      setElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [active, anchorMs]);

  return elapsed;
}

/** Form sentinel for priority infinity (lowest / unlimited rank in the stepper). */
export const PRIORITY_WEIGHT_INFINITY = 'inf';

export function encodePrioritySelectorValue(priorityWeight: string): number {
  const trimmed = priorityWeight.trim();
  if (!trimmed) {
    return 0;
  }
  if (trimmed === PRIORITY_WEIGHT_INFINITY) {
    return -1;
  }
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function decodePrioritySelectorValue(value: number): string {
  if (value === -1) {
    return PRIORITY_WEIGHT_INFINITY;
  }
  if (value <= 0) {
    return '';
  }
  return String(value);
}

/** Maps form priority weight to API Priority (null when unset or infinity). */
export function parsePriorityWeight(priorityWeight: string): number | null {
  const trimmed = priorityWeight.trim();
  if (!trimmed || trimmed === PRIORITY_WEIGHT_INFINITY) {
    return null;
  }
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

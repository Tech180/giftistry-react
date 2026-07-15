export function hasPriorityValue(priority: number | null | undefined): priority is number {
  return priority !== null && priority !== undefined;
}

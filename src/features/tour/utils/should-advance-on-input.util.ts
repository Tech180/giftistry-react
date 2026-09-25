/**
 * Returns true when a tour input-advance target has a non-empty trimmed value.
 */
export function shouldAdvanceOnInputValue(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

/**
 * True when an enrich job Result reports AI populate soft-failure.
 */
export function isAiPopulateFailed(
  result: Record<string, unknown> | null | undefined
): boolean {
  if (!result || typeof result !== 'object') return false;
  const diagnostics = result.Diagnostics;
  if (!diagnostics || typeof diagnostics !== 'object') return false;
  return (diagnostics as Record<string, unknown>).AiPopulate === 'failed';
}

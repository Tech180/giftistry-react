import type { ResolveItemEnrichRequestInput } from '../interfaces/resolve-item-enrich-request-input.interface';
import type { ResolveItemEnrichRequestResult } from '../interfaces/resolve-item-enrich-request-result.interface';

/**
 * Chooses enrich job intent for Manual grab-info.
 * Substitution editors always draft-populate so they never write back to the parent item.
 */
export function resolveItemEnrichRequest(
  input: ResolveItemEnrichRequestInput
): ResolveItemEnrichRequestResult {
  if (input.isSubstitutionEditor || !input.persistedItemId) {
    return {
      intent: 'draft-populate',
      itemId: undefined,
      writeBack: false,
    };
  }

  return {
    intent: 'update-item',
    itemId: input.persistedItemId,
    writeBack: true,
  };
}

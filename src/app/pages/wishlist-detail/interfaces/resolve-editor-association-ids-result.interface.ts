import type { LinkingAudienceContext } from 'features/items/interfaces/linking-audience-context.interface';

export interface ResolveEditorAssociationIdsResult {
  sourceContext: LinkingAudienceContext;
  linkedItemIds: string[];
  relatedItemIds: string[];
}

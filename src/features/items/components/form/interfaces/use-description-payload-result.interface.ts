import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';

export interface UseDescriptionPayloadResult {
  buildDescriptionPayload: (options: {
    canManageItems: boolean;
    isFavorite: boolean;
  }) => ItemDescriptionMetadata | null;
  buildSubstitutionMetadata: () => ItemDescriptionMetadata;
}

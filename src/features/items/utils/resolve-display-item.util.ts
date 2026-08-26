import { normalizeItemDescriptionMetadata } from 'shared/utils/item-custom-fields.util';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type { Item } from '../interfaces/item.interface';
import type { ItemSubstitutionSummary } from '../interfaces/item-substitution.interface';
import type { SubstitutionBrowseOption } from './resolve-item-substitution-options.util';

function metadataFromSubstitutionSummary(
  child: ItemSubstitutionSummary
): ItemDescriptionMetadata {
  return normalizeItemDescriptionMetadata({
    Text: child.Description,
    CustomFields: {
      Predefined: child.CustomFields?.Predefined ?? {},
      UserDefined: child.CustomFields?.UserDefined ?? {},
    },
    MultiCount: child.MultiCount || undefined,
    DesiredQuantity: child.DesiredQuantity ?? undefined,
    Variations: child.Variations ?? undefined,
    IsFavorite: child.IsFavorite || undefined,
    IsPinned: child.IsPinned || undefined,
  });
}

/**
 * Build the item shape shown on the card for the active browse option.
 * Substitution children overlay product fields only — never inherit parent
 * description / custom-field metadata.
 */
export function resolveDisplayItem(
  parent: Item,
  active: SubstitutionBrowseOption
): Item {
  if (active.kind === 'original' || !active.option) {
    return parent;
  }

  const child = active.option.Item;
  const metadata = metadataFromSubstitutionSummary(child);

  return {
    ...parent,
    Id: child.Id,
    Name: child.Name,
    Description: child.Description,
    Category: child.Category || parent.Category || 'uncategorized',
    PriorityId: child.PriorityId ?? null,
    Priority: child.Priority ?? null,
    Links: child.Links ?? [],
    Claims: child.Claims ?? [],
    IsClaimed: child.IsClaimed,
    IsFullyClaimed: child.IsFullyClaimed,
    Photos: child.Photos ?? parent.Photos,
    Metadata: metadata,
    DesiredQuantity: child.DesiredQuantity ?? null,
    IsMultiCount: child.MultiCount === true,
    AllowSubstitutions: false,
    SubstitutionOptions: undefined,
    ActiveSubstitutionId: active.option.Id,
  };
}

import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import {
  getMetadataDisplayEntries,
  getUserDefinedEntries,
} from 'shared/utils/item-custom-fields.util';

export interface ItemMetadataDisplay {
  predefinedDisplayEntries: { label: string; value: string }[];
  userDefinedEntries: { name: string; value: string }[];
}

export function resolveItemMetadataDisplay(
  metadata: ItemDescriptionMetadata | null | undefined
): ItemMetadataDisplay {
  const userDefinedEntries = getUserDefinedEntries(metadata);
  const userNames = new Set(userDefinedEntries.map((entry) => entry.name));
  const predefinedDisplayEntries = getMetadataDisplayEntries(metadata).filter(
    (entry) => !userNames.has(entry.label)
  );
  return { predefinedDisplayEntries, userDefinedEntries };
}

export function hasItemMetadataDisplay(
  display: ItemMetadataDisplay
): boolean {
  return (
    display.predefinedDisplayEntries.length > 0 ||
    display.userDefinedEntries.length > 0
  );
}

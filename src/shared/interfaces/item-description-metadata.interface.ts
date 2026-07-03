export interface ItemDescriptionMetadata {
  text?: string;
  pantsSize?: string;
  shirtSize?: string;
  shoesSize?: string;
  socksSize?: string;
  color?: string;
  custom?: { name: string; value: string }[];
  isFavorite?: boolean;
  isPinned?: boolean;
  desiredQuantity?: number;
  variations?: { name: string; quantity: number }[];
  linkedItemIds?: string[];
  otherUsersCanSee?: boolean;
  multiCount?: boolean;
  [key: string]: unknown;
}

export interface ParsedItemDescription {
  text: string | null;
  metadata: ItemDescriptionMetadata | null;
  isJson: boolean;
}

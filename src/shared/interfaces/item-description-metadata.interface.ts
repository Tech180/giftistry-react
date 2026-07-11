export interface ItemCustomFields {
  Predefined: Record<string, string | null>;
  UserDefined: Record<string, string>;
}

export interface ItemDescriptionMetadata {
  Text?: string;
  text?: string;
  CustomFields?: ItemCustomFields;
  pantsSize?: string;
  shirtSize?: string;
  shoesSize?: string;
  socksSize?: string;
  color?: string;
  custom?: { name: string; value: string }[];
  isFavorite?: boolean;
  isPinned?: boolean;
  desiredQuantity?: number;
  DesiredQuantity?: number;
  variations?: { name: string; quantity: number }[];
  Variations?: { name: string; quantity: number }[];
  linkedItemIds?: string[];
  LinkedItemIds?: string[];
  otherUsersCanSee?: boolean;
  OtherUsersCanSee?: boolean;
  multiCount?: boolean;
  MultiCount?: boolean;
  [key: string]: unknown;
}

export interface ParsedItemDescription {
  text: string | null;
  metadata: ItemDescriptionMetadata | null;
  isJson: boolean;
}

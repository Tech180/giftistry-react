export interface ItemCustomFields {
  Predefined: Record<string, string | null>;
  UserDefined: Record<string, string>;
}

export interface ItemDescriptionVariation {
  Name: string;
  Quantity: number;
}

export interface ItemDescriptionMetadata {
  Text?: string | null;
  CustomFields?: ItemCustomFields;
  IsFavorite?: boolean;
  IsPinned?: boolean;
  DesiredQuantity?: number;
  Variations?: ItemDescriptionVariation[];
  LinkedItemIds?: string[];
  OtherUsersCanSee?: boolean;
  MultiCount?: boolean;
}

export interface ParsedItemDescription {
  text: string | null;
  metadata: ItemDescriptionMetadata | null;
  isJson: boolean;
}

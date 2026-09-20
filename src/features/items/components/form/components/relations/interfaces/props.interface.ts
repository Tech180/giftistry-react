import type React from 'react';
import type { Item } from '../../../../../interfaces/item.interface';

export interface Props {
  wishlistItems?: Item[];
  itemId?: string;
  readOnly?: boolean;
  isMultiCount: boolean;
  isSuggestion: boolean;
  isSubstitutionSurface: boolean;
  resolvedLinkedCount: number;
  resolvedRelatedCount: number;
  isLinkingModeActive: boolean;
  setIsLinkingModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  isRelatingModeActive: boolean;
  setIsRelatingModeActive: React.Dispatch<React.SetStateAction<boolean>>;
}

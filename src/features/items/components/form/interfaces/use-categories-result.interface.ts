import type React from 'react';

export interface UseCategoriesResult {
  isAddingCustom: boolean;
  setIsAddingCustom: React.Dispatch<React.SetStateAction<boolean>>;
  newCustomInput: string;
  setNewCustomInput: React.Dispatch<React.SetStateAction<string>>;
  sessionCustomCategories: string[];
  setSessionCustomCategories: React.Dispatch<React.SetStateAction<string[]>>;
  deletedCategories: string[];
  setDeletedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  aiCategoryPrimary: string | null;
  setAiCategoryPrimary: React.Dispatch<React.SetStateAction<string | null>>;
  aiCategoryAlternatives: string[];
  setAiCategoryAlternatives: React.Dispatch<React.SetStateAction<string[]>>;
  renderedCategories: { id: string; label: string; isCustom?: boolean; isFromList?: boolean }[];
  aiCategoryIds: Set<string>;
  aiCategoryChips: Array<{ id: string; label: string; variant: 'primary' | 'suggestion' }>;
  handleAddCustomCategory: () => void;
  handleDeleteCustomCategory: (catId: string) => void;
  clearAiCategories: () => void;
}

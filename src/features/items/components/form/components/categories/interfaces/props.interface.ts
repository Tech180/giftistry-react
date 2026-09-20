export interface Props {
  category: string;
  setCategory: (val: string) => void;
  priorityWeight: string;
  setPriorityWeight: (val: string) => void;
  renderedCategories: { id: string; label: string; isCustom?: boolean; isFromList?: boolean }[];
  aiCategoryChips: Array<{ id: string; label: string; variant: 'primary' | 'suggestion' }>;
  aiCategoryIds: Set<string>;
  isAddingCustom: boolean;
  setIsAddingCustom: (val: boolean) => void;
  newCustomInput: string;
  setNewCustomInput: (val: string) => void;
  handleAddCustomCategory: () => void;
  handleDeleteCustomCategory: (catId: string) => void;
  canShowAi?: boolean;
  isSubstitutionSurface: boolean;
}

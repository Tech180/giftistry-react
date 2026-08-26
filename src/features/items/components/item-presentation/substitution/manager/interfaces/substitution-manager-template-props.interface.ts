import type { ItemSubstitutionOption } from '../../../../../interfaces/item-substitution.interface';

export interface SubstitutionManagerTemplateProps {
  allowSubstitutions: boolean;
  onAllowSubstitutionsChange: (value: boolean) => void;
  ownerOptions: ItemSubstitutionOption[];
  canAddMore: boolean;
  disabled?: boolean;
  hasParentItem: boolean;
  onAddClick: () => void;
  onEditClick: (option: ItemSubstitutionOption) => void;
  onDeleteClick: (option: ItemSubstitutionOption) => void;
  onMoveUp: (option: ItemSubstitutionOption) => void;
  onMoveDown: (option: ItemSubstitutionOption) => void;
  busy?: boolean;
}

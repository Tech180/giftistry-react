import type { ItemSubstitutionOption } from '../../../../../interfaces/item-substitution.interface';

export interface SubstitutionManagerProps {
  parentItemId: string | undefined;
  options: ItemSubstitutionOption[];
  allowSubstitutions: boolean;
  onAllowSubstitutionsChange: (value: boolean) => void;
  onOpenCreate: () => void;
  onOpenEdit: (option: ItemSubstitutionOption) => void;
  onDelete: (substitutionId: string) => Promise<void>;
  onReorder: (orderedIds: string[]) => Promise<void>;
  disabled?: boolean;
}

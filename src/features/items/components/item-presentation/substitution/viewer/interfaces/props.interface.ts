import type { ItemSubstitutionOption } from '../../../../../interfaces/item-substitution.interface';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  option: ItemSubstitutionOption | null;
}

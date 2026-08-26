import type { ItemSubstitutionOption } from '../../../../../interfaces/item-substitution.interface';

export interface SubstitutionViewerProps {
  isOpen: boolean;
  onClose: () => void;
  option: ItemSubstitutionOption | null;
}

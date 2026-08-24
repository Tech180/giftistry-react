import type { ClaimFormQuantityRow } from './claim-form-quantity-row.interface';
import type { Item } from '../../../../interfaces/item.interface';

export interface ClaimFormTemplateProps {
  prompt: string;
  title: string;
  confirmLabel: string;
  anonymous: boolean;
  onAnonymousChange: (checked: boolean) => void;
  compact: boolean;
  showQuantityUi: boolean;
  showVariationList: boolean;
  quantityRows: ClaimFormQuantityRow[];
  totalRemaining: number;
  confirmDisabled: boolean;
  confirmLoading: boolean;
  onQuantityChange: (selection: string | null, quantity: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
  linkedItems?: Item[];
  wishlistItems?: Item[];
  onLinkedItemClick?: (itemId: string) => void;
}

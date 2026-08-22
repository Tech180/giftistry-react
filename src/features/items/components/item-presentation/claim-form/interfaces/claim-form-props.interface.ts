import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type { ClaimQuantityDraft } from '../../../../interfaces/claim-quantity-draft.interface';
import type { Item } from '../../../../interfaces/item.interface';
import type { ItemActions } from '../../../../interfaces/item-actions.interface';

export interface ClaimFormProps {
  item: Item;
  metadata?: ItemDescriptionMetadata | null;
  userId?: string | null;
  claimedByName: string | null;
  itemActions: ItemActions;
  anonymous: boolean;
  onAnonymousChange: (checked: boolean) => void;
  onSubmitted: () => void;
  onCancel: () => void;
  onBeforeSubmit?: (draft: ClaimQuantityDraft[]) => boolean | Promise<boolean>;
  compact?: boolean;
}

import { Item } from './item.interface';
import type { ItemActions } from './item-actions.interface';
import type { ItemSubstitutionOption } from './item-substitution.interface';

export interface ItemShowcaseProps {
  item: Item;
  priorityLabel?: string;
  isOwner: boolean;
  isExpired: boolean;
  isArchived?: boolean;
  canCollaborate: boolean;
  isPublicGuest?: boolean;
  allowGroupFunds: boolean;
  itemActions: ItemActions;
  onEdit?: () => void;
  /** Opens the left drawer to create a claimer custom substitution. */
  onAddSubstitution?: () => void;
  /** Opens the left drawer to edit the caller's own claimer custom substitution. */
  onEditSubstitution?: () => void;
  /** Deletes the caller's own claimer custom substitution. */
  onDeleteSubstitution?: () => void | Promise<void>;
  /**
   * Edit a specific substitution (e.g. owner editing the active browse section).
   * When set, footer Edit on a non-Main section targets this instead of the parent item.
   */
  onEditSubstitutionOption?: (option: ItemSubstitutionOption) => void;
  /** Delete a specific substitution from the footer while browsing that section. */
  onDeleteSubstitutionOption?: (option: ItemSubstitutionOption) => void | Promise<void>;
  onClose: () => void;
  wishlistItems?: Item[];
  aiEnabled?: boolean;
  variant?: 'card' | 'inline';
  onLinkedItemNavigate?: (itemId: string, returnToItemId?: string) => void;
  onLinkedItemsUnsupported?: () => void;
}

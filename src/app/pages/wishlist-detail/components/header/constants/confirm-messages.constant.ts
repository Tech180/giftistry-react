import type { ConfirmAction } from '../../../interfaces/confirm-action.type';

export const CONFIRM_MESSAGES: Record<Exclude<ConfirmAction, null>, string> = {
  deactivate: 'Are you sure you want to deactivate and archive this wishlist?',
  activate: 'Are you sure you want to restore this wishlist from the archive?',
  duplicate: 'Duplicate this list for yourself?',
  delete: 'Are you sure you want to permanently delete this wishlist and all of its items?',
};

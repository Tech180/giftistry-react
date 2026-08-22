import type { ItemActions } from 'features/items';

function readOnly(): never {
  throw new Error('Guest preview is read-only');
}

export const GUEST_ITEM_ACTIONS: ItemActions = {
  updateItem: async () => readOnly(),
  addItemLink: async () => readOnly(),
  claimItem: async () => readOnly(),
  claimItems: async () => readOnly(),
  unclaimItem: async () => readOnly(),
  deleteItem: async () => readOnly(),
};

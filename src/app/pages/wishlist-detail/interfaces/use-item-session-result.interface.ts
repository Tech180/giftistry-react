import type { RefObject } from 'react';
import type { Item } from 'features/items';
import type { ImportStripHandle } from 'features/items';
import type { ItemEnrichJobResult } from 'features/jobs';

export interface UseItemSessionResult {
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  openAddDrawer: () => void;
  isAutoAddOpen: boolean;
  openAutoAdd: () => void;
  closeAutoAdd: () => void;
  onAutoAddStarted: (result: ItemEnrichJobResult) => void;
  editingItem: Item | null;
  setEditingItem: (item: Item | null) => void;
  openItemEditor: (item: Item) => void;
  viewingItem: Item | null;
  setViewingItem: (item: Item | null) => void;
  openItemViewer: (item: Item) => void;
  openClaimerSubstitutionCreate: (item: Item) => void;
  claimerSubstitutionCreateNonce: number;
  openClaimerSubstitutionEdit: (item: Item) => void;
  claimerSubstitutionEditNonce: number;
  claimerSubstitutionEditId: string | null;
  deleteClaimerSubstitution: (item: Item) => Promise<void>;
  openSubstitutionEdit: (item: Item, substitutionId: string) => void;
  deleteSubstitutionOption: (substitutionId: string) => Promise<void>;
  clearSubstitutionAutoOpen: () => void;
  setEditingItemDraft: (draft: Partial<Item> | null) => void;
  editingItemDraft: Partial<Item> | null;
  isImportOpen: boolean;
  setIsImportOpen: (open: boolean) => void;
  importStripRef: RefObject<ImportStripHandle | null>;
}

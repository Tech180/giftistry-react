import type { Item } from 'features/items';
import { UNCATEGORIZED_CATEGORY_KEY } from '../constants/category-group.constant';
import type { BuildDraftSourceItemInput } from '../interfaces/build-draft-source-item-input.interface';

export function buildDraftSourceItem(input: BuildDraftSourceItemInput): Item | null {
  const { editingItem, editingItemDraft, isAddOpen, canCollaborate, wishlistId } = input;

  if (editingItem) {
    const draftMeta = editingItemDraft?.Metadata ?? null;
    const mergedMeta = {
      ...(editingItem.Metadata ?? {}),
      ...(draftMeta ?? {}),
    };
    const draftQty = editingItemDraft?.DesiredQuantity ?? draftMeta?.DesiredQuantity ?? null;

    return {
      ...editingItem,
      ...(editingItemDraft ?? {}),
      Metadata: mergedMeta,
      DesiredQuantity: draftQty != null ? Number(draftQty) || 1 : editingItem.DesiredQuantity,
      IsMultiCount: editingItemDraft?.IsMultiCount ?? draftMeta?.MultiCount ?? editingItem.IsMultiCount,
      IsSuggestion: editingItem.IsSuggestion ?? !canCollaborate,
    };
  }

  if (isAddOpen && editingItemDraft) {
    return {
      Id: 'draft',
      ListId: wishlistId ?? '',
      PriorityId: null,
      SuggestedByUserId: null,
      Name: editingItemDraft.Name ?? 'Draft',
      Description: editingItemDraft.Description ?? null,
      IsHiddenIdea: false,
      Category: editingItemDraft.Category ?? UNCATEGORIZED_CATEGORY_KEY,
      Links: [],
      Claims: [],
      IsClaimed: false,
      DesiredQuantity: editingItemDraft.DesiredQuantity ?? 1,
      IsMultiCount: editingItemDraft.IsMultiCount ?? false,
      Metadata: editingItemDraft.Metadata ?? null,
      IsSuggestion: editingItemDraft.IsSuggestion ?? !canCollaborate,
    };
  }

  return null;
}

import type { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import type { ItemSubstitutionOption } from '../../../../../interfaces/item-substitution.interface';
import type { SubstitutionEditorState } from '../../../interfaces/substitution-editor-state.type';

export interface Props {
  canCollaborate: boolean;
  isSuggestion: boolean;
  isLoading: boolean;
  readOnly?: boolean;
  isEdit?: boolean;
  isHiddenIdea: boolean;
  setIsHiddenIdea: (val: boolean) => void;
  otherUsersCanSee: boolean;
  setOtherUsersCanSee: (val: boolean) => void;
  claimOnCreate: boolean;
  setClaimOnCreate: (val: boolean) => void;
  itemId?: string;
  allowSubstitutions: boolean;
  setAllowSubstitutions: (value: boolean) => void;
  substitutionOptions: ItemSubstitutionOption[];
  onOpenCreateSubstitution: () => void;
  onOpenEditSubstitution: (option: ItemSubstitutionOption) => void;
  onDeleteOwnerSubstitution: (substitutionId: string) => Promise<void>;
  onReorderOwnerSubstitutions: (orderedIds: string[]) => Promise<void>;
  listShares: ListShare[];
  sharedWithUserIds: string[];
  setSharedWithUserIds: (userIds: string[]) => void;
  visibilityMode: 'everyone' | 'restricted' | 'private';
  onVisibilityModeChange: (mode: 'everyone' | 'restricted' | 'private') => void;
  substitutionEditor: SubstitutionEditorState | null;
}

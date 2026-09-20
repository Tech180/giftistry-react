import type React from 'react';
import type { ItemSubstitutionOption } from '../../../interfaces/item-substitution.interface';
import type { SubstitutionEditorState } from './substitution-editor-state.type';

export interface UseSubstitutionsResult {
  substitutionEditor: SubstitutionEditorState | null;
  substitutionEditorRef: React.RefObject<SubstitutionEditorState | null>;
  subSaving: boolean;
  openCreateSubstitution: () => void;
  openEditSubstitution: (option: ItemSubstitutionOption) => void;
  handleDeleteOwnerSubstitution: (substitutionId: string) => Promise<void>;
  handleReorderOwnerSubstitutions: (orderedIds: string[]) => Promise<void>;
  handleSubstitutionSubmit: (e: React.SyntheticEvent) => Promise<void>;
}

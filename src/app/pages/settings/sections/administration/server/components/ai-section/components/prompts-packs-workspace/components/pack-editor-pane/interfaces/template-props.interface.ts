import type { PackEditorDraft } from './pack-editor-draft.interface';
import type { PackEditorMode } from './pack-editor-mode.type';

export interface PackEditorPaneTemplateProps {
  mode: PackEditorMode;
  draft: PackEditorDraft;
  heading: string;
  errorMessage: string | null;
  disabled: boolean;
  canDelete: boolean;
  onBack: () => void;
  onLabelChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoriesChange: (value: string) => void;
  onTitleKeywordsChange: (value: string) => void;
  onPromptFragmentChange: (value: string) => void;
  onFieldKeyChange: (index: number, value: string) => void;
  onFieldLabelChange: (index: number, value: string) => void;
  onFieldBucketChange: (index: number, value: 'predefined' | 'userDefined') => void;
  onFieldHintChange: (index: number, value: string) => void;
  onRemoveField: (index: number) => void;
  onAddField: () => void;
  onApply: () => void;
  onDelete: () => void;
}

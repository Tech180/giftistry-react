import type { PackEditorFieldDraft } from '../../pack-editor-pane/interfaces/pack-editor-field-draft.interface';

export interface PackFieldEditorProps {
  field: PackEditorFieldDraft;
  disabled: boolean;
  onKeyChange: (value: string) => void;
  onLabelChange: (value: string) => void;
  onBucketChange: (value: 'predefined' | 'userDefined') => void;
  onHintChange: (value: string) => void;
  onRemove: () => void;
}

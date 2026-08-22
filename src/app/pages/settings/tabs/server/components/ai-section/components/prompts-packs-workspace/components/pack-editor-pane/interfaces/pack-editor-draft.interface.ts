import type { PackEditorFieldDraft } from './pack-editor-field-draft.interface';

export interface PackEditorDraft {
  id: string;
  label: string;
  description: string;
  promptFragment: string;
  categoriesText: string;
  titleKeywordsText: string;
  fields: PackEditorFieldDraft[];
}

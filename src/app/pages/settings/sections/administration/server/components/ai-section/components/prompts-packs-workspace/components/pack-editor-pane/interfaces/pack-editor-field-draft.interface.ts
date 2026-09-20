export interface PackEditorFieldDraft {
  key: string;
  label: string;
  bucket: 'predefined' | 'userDefined';
  hint: string;
}

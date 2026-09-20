export interface CustomFieldRow {
  id: string;
  name: string;
  value: string;
  bucket: 'predefined' | 'userDefined';
  storageKey?: string;
}

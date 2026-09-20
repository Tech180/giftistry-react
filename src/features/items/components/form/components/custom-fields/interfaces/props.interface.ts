import type { FieldDefinition } from '../../../../../interfaces/field-definition.interface';
import type { CustomFieldRow } from '../../../../../interfaces/custom-field-row.interface';

export interface Props {
  category: string;
  getFriendlyCategoryLabel: (id: string) => string;
  showExtraFields: boolean;
  setShowExtraFields: (val: boolean) => void;
  hasIncompleteCustomFields: boolean;
  showFieldDefinitions: boolean;
  definitions: FieldDefinition[];
  isFieldVisible: (def: FieldDefinition) => boolean;
  dynamicValues: Record<string, string>;
  handleUpdateDynamicValue: (key: string, val: string) => void;
  customFields: CustomFieldRow[];
  handleAddCustomField: () => void;
  handleRemoveCustomField: (id: string) => void;
  handleUpdateCustomField: (id: string, key: 'name' | 'value', value: string) => void;
  editingCustomFieldNameId: string | null;
  onStartEditCustomFieldName: (id: string) => void;
  onFinishEditCustomFieldName: () => void;
}

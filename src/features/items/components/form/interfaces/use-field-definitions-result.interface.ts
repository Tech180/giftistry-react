import type React from 'react';
import type { FieldDefinition } from '../../../api/items.api';
import type { ExtractMetadataResult } from '../../../interfaces/extract-metadata-result.interface';

export interface UseFieldDefinitionsResult {
  definitions: FieldDefinition[];
  setDefinitions: React.Dispatch<React.SetStateAction<FieldDefinition[]>>;
  isFieldVisible: (def: FieldDefinition) => boolean;
  applyExtractedCustomFields: (data: ExtractMetadataResult) => void;
  showFieldDefinitions: boolean;
  readOnlyMetadataDisplay: {
    predefinedDisplayEntries: { label: string; value: string }[];
    userDefinedEntries: { name: string; value: string }[];
  };
  hasReadOnlyMetadata: boolean;
}

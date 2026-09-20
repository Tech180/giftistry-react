import { useCallback, useEffect, useState } from 'react';
import type React from 'react';
import { itemsApi, type FieldDefinition } from '../../../api/items.api';
import type { Item } from '../../../interfaces/item.interface';
import type { ExtractMetadataResult } from '../../../interfaces/extract-metadata-result.interface';
import type { CustomFieldRow } from '../../../interfaces/custom-field-row.interface';
import type { SubstitutionEditorState } from '../interfaces/substitution-editor-state.type';
import {
  definitionFieldKeysFromDefinitions,
  partitionExtractedCustomFields,
  rowsFromExtractedMetadata,
  rowsFromItemMetadata,
} from '../../../utils/add-item-custom-fields.util';
import { parseItemDescription } from 'shared/utils/parse-item-description.util';
import {
  hasItemMetadataDisplay,
  resolveItemMetadataDisplay,
} from '../../../utils/resolve-item-metadata-display.util';
import { normalizeItemDescriptionMetadata } from 'shared/utils/item-custom-fields.util';
import type { UseFieldDefinitionsResult } from '../interfaces/use-field-definitions-result.interface';

function mapCategoryForDefinitions(cat: string): string {
  const c = cat.toLowerCase();
  if (c === 'apparel_accessories' || c === 'clothing') {
    return 'clothing';
  }
  if (c === 'digital_tech' || c === 'tech') {
    return 'tech';
  }
  return c;
}

export function useFieldDefinitions(options: {
  category: string;
  canShowAi: boolean;
  readOnly: boolean;
  substitutionEditor: SubstitutionEditorState | null;
  substitutionEditorRef: React.RefObject<SubstitutionEditorState | null>;
  item: Item | null | undefined;
  loadedItemId: string | null;
  hasScraped: boolean;
  dynamicValues: Record<string, string>;
  setDynamicValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setCustomFields: React.Dispatch<React.SetStateAction<CustomFieldRow[]>>;
  loadedMetadataRef: React.RefObject<{
    predefined: Record<string, string | null | undefined>;
    userDefined: Record<string, string>;
  } | null>;
  pendingExtractedRef: React.RefObject<ExtractMetadataResult | null>;
  lastPartitionDefKeysRef: React.RefObject<string>;
}): UseFieldDefinitionsResult {
  const {
    category,
    canShowAi,
    readOnly,
    substitutionEditor,
    substitutionEditorRef,
    item,
    loadedItemId,
    hasScraped,
    dynamicValues,
    setDynamicValues,
    setCustomFields,
    loadedMetadataRef,
    pendingExtractedRef,
    lastPartitionDefKeysRef,
  } = options;

  const [definitions, setDefinitions] = useState<FieldDefinition[]>([]);

  useEffect(() => {
    if (canShowAi) {
      setDefinitions([]);
      return;
    }

    if (readOnly && !substitutionEditor) {
      setDefinitions([]);
      return;
    }

    const fetchDefinitions = async () => {
      const mappedCat = mapCategoryForDefinitions(category);
      try {
        const res = await itemsApi.getFieldDefinitions(mappedCat);
        setDefinitions(res || []);
      } catch {
        setDefinitions([]);
      }
    };
    if (category) {
      void fetchDefinitions();
    } else {
      setDefinitions([]);
    }
  }, [category, canShowAi, readOnly, substitutionEditor]);

  useEffect(() => {
    if (substitutionEditorRef.current) {
      return;
    }
    if (canShowAi || !loadedMetadataRef.current || !item || loadedItemId !== item.Id) {
      return;
    }
    if (definitions.length === 0) {
      return;
    }

    const { fieldKeys, labels } = definitionFieldKeysFromDefinitions(definitions);
    const mapped = rowsFromItemMetadata(
      loadedMetadataRef.current.predefined,
      loadedMetadataRef.current.userDefined,
      fieldKeys,
      labels
    );
    setDynamicValues(mapped.dynamicValues);
    setCustomFields(mapped.customFieldRows);
  }, [
    definitions,
    canShowAi,
    item,
    loadedItemId,
    loadedMetadataRef,
    setCustomFields,
    setDynamicValues,
    substitutionEditorRef,
  ]);

  const applyExtractedCustomFields = useCallback(
    (data: ExtractMetadataResult) => {
      if (canShowAi) {
        const rows = rowsFromExtractedMetadata(data);
        if (rows.length > 0) {
          setCustomFields(rows);
        }
        return;
      }

      const { fieldKeys, labels } = definitionFieldKeysFromDefinitions(definitions);
      const { dynamicValues: scrapedDynamic, customFieldRows } = partitionExtractedCustomFields(
        data,
        fieldKeys,
        labels
      );
      setDynamicValues((prev) => ({ ...prev, ...scrapedDynamic }));
      setCustomFields(customFieldRows);
      lastPartitionDefKeysRef.current = fieldKeys.slice().sort().join('|');
    },
    [canShowAi, definitions, lastPartitionDefKeysRef, setCustomFields, setDynamicValues]
  );

  useEffect(() => {
    if (canShowAi || !pendingExtractedRef.current) {
      return;
    }

    const { fieldKeys } = definitionFieldKeysFromDefinitions(definitions);
    const defSig = fieldKeys.slice().sort().join('|');
    if (!defSig || defSig === lastPartitionDefKeysRef.current) {
      return;
    }

    applyExtractedCustomFields(pendingExtractedRef.current);
  }, [
    definitions,
    canShowAi,
    applyExtractedCustomFields,
    lastPartitionDefKeysRef,
    pendingExtractedRef,
  ]);

  const isFieldVisible = useCallback(
    (def: FieldDefinition) => {
      if (!def.Dependencies || def.Dependencies.length === 0) {
        return true;
      }
      return def.Dependencies.every((dep) => {
        const triggerVal = dynamicValues[dep.TriggerFieldKey] || '';
        if (dep.TriggerValue === 'any') {
          return triggerVal.trim().length > 0;
        }
        return triggerVal.toLowerCase() === dep.TriggerValue.toLowerCase();
      });
    },
    [dynamicValues]
  );

  const showOptionalSizing = (category && category !== 'uncategorized') || hasScraped;
  const showFieldDefinitions =
    showOptionalSizing && !canShowAi && definitions.length > 0 && !(readOnly && !substitutionEditor);

  const readOnlyMetadataDisplay =
    !readOnly || substitutionEditor || !item
      ? { predefinedDisplayEntries: [], userDefinedEntries: [] }
      : (() => {
          const parsed = parseItemDescription(item.Description, item.Metadata);
          const meta =
            parsed.isJson && parsed.metadata
              ? normalizeItemDescriptionMetadata(parsed.metadata)
              : null;
          return resolveItemMetadataDisplay(meta);
        })();

  const hasReadOnlyMetadata = hasItemMetadataDisplay(readOnlyMetadataDisplay);

  return {
    definitions,
    setDefinitions,
    isFieldVisible,
    applyExtractedCustomFields,
    showFieldDefinitions,
    readOnlyMetadataDisplay,
    hasReadOnlyMetadata,
  };
}

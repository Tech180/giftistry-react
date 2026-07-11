import type { ExtractMetadataResult } from '../api/items.api';
import { formatPredefinedKeyToLabel, toStoragePredefinedKey } from 'shared/utils/item-custom-fields.util';

export type CustomFieldRow = {
  id: string;
  name: string;
  value: string;
  bucket: 'predefined' | 'userDefined';
  storageKey?: string;
};

/** Maps canonical backend keys to legacy field-definition keys in the DB. */
const CANONICAL_TO_DEFINITION_KEY: Record<string, string> = {
  Color: 'preferredColor',
  color: 'preferredColor',
  PreferredColor: 'preferredColor',
  PantsSize: 'pantsSize',
  pantsSize: 'pantsSize',
  ShirtSize: 'shirtSize',
  shirtSize: 'shirtSize',
  ShoesSize: 'shoesSize',
  shoesSize: 'shoesSize',
  SocksSize: 'socksSize',
  socksSize: 'socksSize',
  ModelNumber: 'modelNumber',
  modelNumber: 'modelNumber',
  StorageCapacity: 'storageCapacity',
  storageCapacity: 'storageCapacity',
};

function normalizeFieldKey(key: string): string {
  if (!key) return key;
  if (/^[a-z]/.test(key)) return key;
  return key.charAt(0).toLowerCase() + key.slice(1);
}

function toStorageKey(key: string): string {
  return toStoragePredefinedKey(normalizeFieldKey(key));
}

function normalizeLabel(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function resolveDefinitionFieldKey(
  scrapeKey: string,
  definitionFieldKeys: string[]
): string | null {
  const defSet = new Set(definitionFieldKeys);
  if (defSet.has(scrapeKey)) return scrapeKey;

  const camelKey = normalizeFieldKey(scrapeKey);
  if (defSet.has(camelKey)) return camelKey;

  const alias = CANONICAL_TO_DEFINITION_KEY[scrapeKey] ?? CANONICAL_TO_DEFINITION_KEY[toStorageKey(scrapeKey)];
  if (alias && defSet.has(alias)) return alias;

  for (const defKey of definitionFieldKeys) {
    if (toStorageKey(defKey) === toStorageKey(scrapeKey)) return defKey;
  }

  return null;
}

export function createCustomFieldRow(
  partial: Omit<CustomFieldRow, 'id'> & { id?: string }
): CustomFieldRow {
  return {
    id: partial.id ?? Math.random().toString(),
    name: partial.name,
    value: partial.value,
    bucket: partial.bucket,
    storageKey: partial.storageKey,
  };
}

function isDuplicateUserDefinedName(
  name: string,
  absorbedDefinitionKeys: Set<string>,
  absorbedLabels: Set<string>
): boolean {
  const normalizedName = normalizeLabel(name);
  if (!normalizedName) return false;

  for (const defKey of absorbedDefinitionKeys) {
    if (normalizeLabel(defKey) === normalizedName) return true;
    if (normalizeLabel(formatPredefinedKeyToLabel(defKey)) === normalizedName) return true;
    if (normalizeLabel(formatPredefinedKeyToLabel(toStorageKey(defKey))) === normalizedName) return true;
  }

  for (const label of absorbedLabels) {
    if (normalizeLabel(label) === normalizedName) return true;
  }

  return false;
}

export function partitionExtractedCustomFields(
  data: ExtractMetadataResult,
  definitionFieldKeys: string[],
  definitionLabels: Record<string, string> = {}
): { dynamicValues: Record<string, string>; customFieldRows: CustomFieldRow[] } {
  if (definitionFieldKeys.length === 0) {
    return {
      dynamicValues: {},
      customFieldRows: rowsFromExtractedMetadata(data),
    };
  }

  const dynamicValues = applyExtractedToDynamicValues(data, definitionFieldKeys);
  const customFieldRows = leftoverExtractedRows(data, definitionFieldKeys, definitionLabels);
  return { dynamicValues, customFieldRows };
}

export function rowsFromExtractedMetadata(data: ExtractMetadataResult): CustomFieldRow[] {
  const rows: CustomFieldRow[] = [];
  const seenPredefined = new Set<string>();

  const addPredefined = (rawKey: string, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const storageKey = toStorageKey(rawKey);
    const dedupeKey = storageKey.toLowerCase();
    if (seenPredefined.has(dedupeKey)) return;
    seenPredefined.add(dedupeKey);
    rows.push(
      createCustomFieldRow({
        name: formatPredefinedKeyToLabel(rawKey),
        value: trimmed,
        bucket: 'predefined',
        storageKey,
      })
    );
  };

  for (const [key, value] of Object.entries(data.CustomFields?.Predefined ?? {})) {
    if (typeof value === 'string' && value.trim()) {
      addPredefined(key, value);
    }
  }

  for (const [name, value] of Object.entries(data.CustomFields?.UserDefined ?? {})) {
    const trimmed = typeof value === 'string' ? value.trim() : '';
    if (!trimmed) continue;
    if (rows.some((row) => row.bucket === 'predefined' && normalizeLabel(row.name) === normalizeLabel(name))) {
      continue;
    }
    const dedupeKey = `ud:${normalizeLabel(name)}`;
    if (seenPredefined.has(dedupeKey)) continue;
    seenPredefined.add(dedupeKey);
    rows.push(
      createCustomFieldRow({
        name,
        value: trimmed,
        bucket: 'userDefined',
      })
    );
  }

  return rows;
}

export function applyExtractedToDynamicValues(
  data: ExtractMetadataResult,
  definitionFieldKeys: string[]
): Record<string, string> {
  const values: Record<string, string> = {};

  for (const [key, value] of Object.entries(data.CustomFields?.Predefined ?? {})) {
    if (typeof value !== 'string' || !value.trim()) continue;
    const defKey = resolveDefinitionFieldKey(key, definitionFieldKeys);
    if (defKey) values[defKey] = value.trim();
  }

  return values;
}

export function leftoverExtractedRows(
  data: ExtractMetadataResult,
  definitionFieldKeys: string[],
  definitionLabels: Record<string, string> = {}
): CustomFieldRow[] {
  const rows: CustomFieldRow[] = [];
  const absorbedDefinitionKeys = new Set<string>();
  const absorbedLabels = new Set<string>();

  for (const defKey of definitionFieldKeys) {
    absorbedDefinitionKeys.add(defKey);
    absorbedDefinitionKeys.add(toStorageKey(defKey));
    const label = definitionLabels[defKey] ?? formatPredefinedKeyToLabel(defKey);
    absorbedLabels.add(normalizeLabel(label));
    absorbedLabels.add(normalizeLabel(formatPredefinedKeyToLabel(toStorageKey(defKey))));
  }

  for (const [key, value] of Object.entries(data.CustomFields?.Predefined ?? {})) {
    if (typeof value !== 'string' || !value.trim()) continue;
    if (resolveDefinitionFieldKey(key, definitionFieldKeys)) continue;
    rows.push(
      createCustomFieldRow({
        name: formatPredefinedKeyToLabel(key),
        value: value.trim(),
        bucket: 'predefined',
        storageKey: toStorageKey(key),
      })
    );
  }

  for (const [name, value] of Object.entries(data.CustomFields?.UserDefined ?? {})) {
    if (typeof value !== 'string' || !value.trim()) continue;
    if (resolveDefinitionFieldKey(name, definitionFieldKeys)) continue;
    if (isDuplicateUserDefinedName(name, absorbedDefinitionKeys, absorbedLabels)) continue;
    rows.push(
      createCustomFieldRow({
        name,
        value: value.trim(),
        bucket: 'userDefined',
      })
    );
  }

  return rows;
}

export function rowsFromItemMetadata(
  predefined: Record<string, string | null | undefined>,
  userDefined: Record<string, string>,
  definitionFieldKeys: string[],
  definitionLabels: Record<string, string> = {}
): { dynamicValues: Record<string, string>; customFieldRows: CustomFieldRow[] } {
  const dynamicValues: Record<string, string> = {};
  const customFieldRows: CustomFieldRow[] = [];
  const absorbedDefinitionKeys = new Set<string>();
  const absorbedLabels = new Set<string>();

  for (const defKey of definitionFieldKeys) {
    absorbedDefinitionKeys.add(defKey);
    absorbedDefinitionKeys.add(toStorageKey(defKey));
    const label = definitionLabels[defKey] ?? formatPredefinedKeyToLabel(defKey);
    absorbedLabels.add(normalizeLabel(label));
  }

  for (const [key, rawVal] of Object.entries(predefined)) {
    if (rawVal == null || !String(rawVal).trim()) continue;
    const val = String(rawVal).trim();
    const defKey = resolveDefinitionFieldKey(key, definitionFieldKeys);
    if (defKey) {
      dynamicValues[defKey] = val;
    } else {
      customFieldRows.push(
        createCustomFieldRow({
          name: formatPredefinedKeyToLabel(key),
          value: val,
          bucket: 'predefined',
          storageKey: toStorageKey(key),
        })
      );
    }
  }

  for (const [name, value] of Object.entries(userDefined)) {
    if (!value.trim()) continue;
    if (resolveDefinitionFieldKey(name, definitionFieldKeys)) continue;
    if (isDuplicateUserDefinedName(name, absorbedDefinitionKeys, absorbedLabels)) continue;
    customFieldRows.push(
      createCustomFieldRow({
        name,
        value: value.trim(),
        bucket: 'userDefined',
      })
    );
  }

  return { dynamicValues, customFieldRows };
}

export function rowsFromItemMetadataAi(
  predefined: Record<string, string | null | undefined>,
  userDefined: Record<string, string>
): CustomFieldRow[] {
  const data: ExtractMetadataResult = {
    Title: '',
    Price: null,
    Description: null,
    Category: null,
    ImageUrl: null,
    CustomFields: {
      Predefined: Object.fromEntries(
        Object.entries(predefined).filter(([, v]) => v != null && String(v).trim())
      ) as Record<string, string>,
      UserDefined: userDefined,
    },
  };
  return rowsFromExtractedMetadata(data);
}

export function splitCustomFieldRowsForSave(rows: CustomFieldRow[]): {
  predefined: Record<string, string | null>;
  userDefined: Record<string, string>;
} {
  const predefined: Record<string, string | null> = {};
  const userDefined: Record<string, string> = {};

  for (const row of rows) {
    if (!row.value.trim()) continue;
    if (row.bucket === 'predefined' && row.storageKey?.trim()) {
      predefined[row.storageKey.trim()] = row.value.trim();
    } else if (row.name.trim()) {
      userDefined[row.name.trim()] = row.value.trim();
    }
  }

  return { predefined, userDefined };
}

export function definitionFieldKeysFromDefinitions(
  definitions: Array<{ FieldKey: string; Label?: string }>
): { fieldKeys: string[]; labels: Record<string, string> } {
  const fieldKeys = definitions.map((def) => def.FieldKey);
  const labels = Object.fromEntries(
    definitions.map((def) => [def.FieldKey, def.Label ?? formatPredefinedKeyToLabel(def.FieldKey)])
  );
  return { fieldKeys, labels };
}

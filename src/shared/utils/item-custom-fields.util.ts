import type {
  ItemCustomFields,
  ItemDescriptionMetadata,
} from 'shared/interfaces/item-description-metadata.interface';

export const CORE_PREDEFINED_FORM_KEYS = [
  'pantsSize',
  'shirtSize',
  'shoesSize',
  'socksSize',
  'color',
] as const;

export type CorePredefinedFormKey = (typeof CORE_PREDEFINED_FORM_KEYS)[number];

const CORE_FORM_TO_STORAGE: Record<CorePredefinedFormKey, string> = {
  pantsSize: 'PantsSize',
  shirtSize: 'ShirtSize',
  shoesSize: 'ShoesSize',
  socksSize: 'SocksSize',
  color: 'Color',
};

const CORE_STORAGE_TO_FORM: Record<string, CorePredefinedFormKey> = {
  PantsSize: 'pantsSize',
  pantsSize: 'pantsSize',
  ShirtSize: 'shirtSize',
  shirtSize: 'shirtSize',
  ShoesSize: 'shoesSize',
  shoesSize: 'shoesSize',
  SocksSize: 'socksSize',
  socksSize: 'socksSize',
  Color: 'color',
  color: 'color',
};

const KNOWN_PREDEFINED_LABELS: Record<string, string> = {
  PantsSize: 'Pants Size',
  pantsSize: 'Pants Size',
  ShirtSize: 'Shirt Size',
  shirtSize: 'Shirt Size',
  ShoesSize: 'Shoes Size',
  shoesSize: 'Shoes Size',
  SocksSize: 'Socks Size',
  socksSize: 'Socks Size',
  Color: 'Color',
  color: 'Color',
  preferredColor: 'Preferred Color',
  PreferredColor: 'Preferred Color',
  ModelNumber: 'Model Number',
  StorageCapacity: 'Storage Capacity',
};

export function formatPredefinedKeyToLabel(key: string): string {
  if (KNOWN_PREDEFINED_LABELS[key]) return KNOWN_PREDEFINED_LABELS[key];
  if (/^[a-z]/.test(key)) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();
  }
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

const RESERVED_METADATA_KEYS = new Set([
  'Text',
  'text',
  'CustomFields',
  'pantsSize',
  'shirtSize',
  'shoesSize',
  'socksSize',
  'color',
  'custom',
  'isFavorite',
  'isPinned',
  'desiredQuantity',
  'DesiredQuantity',
  'variations',
  'Variations',
  'linkedItemIds',
  'LinkedItemIds',
  'otherUsersCanSee',
  'OtherUsersCanSee',
  'multiCount',
  'MultiCount',
]);

export function emptyCustomFields(): ItemCustomFields {
  return { Predefined: {}, UserDefined: {} };
}

export function toStoragePredefinedKey(formKey: string): string {
  return CORE_FORM_TO_STORAGE[formKey as CorePredefinedFormKey] ?? formKey;
}

export function toFormPredefinedKey(storageKey: string): string {
  return CORE_STORAGE_TO_FORM[storageKey] ?? storageKey;
}

export function getMetadataText(metadata: ItemDescriptionMetadata | null | undefined): string {
  if (!metadata) return '';
  const text = metadata.Text ?? metadata.text;
  return typeof text === 'string' ? text : '';
}

export function normalizeItemDescriptionMetadata(
  raw: ItemDescriptionMetadata | null | undefined
): ItemDescriptionMetadata {
  if (!raw) {
    return { Text: '', CustomFields: emptyCustomFields() };
  }

  const predefined: Record<string, string | null> = {
    ...(raw.CustomFields?.Predefined ?? {}),
  };

  for (const formKey of CORE_PREDEFINED_FORM_KEYS) {
    const legacyVal = raw[formKey];
    if (typeof legacyVal === 'string' && legacyVal.trim()) {
      predefined[toStoragePredefinedKey(formKey)] = legacyVal.trim();
    }
  }

  for (const [key, value] of Object.entries(raw)) {
    if (RESERVED_METADATA_KEYS.has(key)) continue;
    if (value == null || value === '') continue;
    if (typeof value === 'string') {
      predefined[key] = value;
    }
  }

  const userDefined: Record<string, string> = { ...(raw.CustomFields?.UserDefined ?? {}) };
  if (Array.isArray(raw.custom)) {
    for (const field of raw.custom) {
      if (field.name?.trim() && field.value?.trim()) {
        userDefined[field.name.trim()] = field.value.trim();
      }
    }
  }

  return {
    Text: getMetadataText(raw),
    CustomFields: { Predefined: predefined, UserDefined: userDefined },
    desiredQuantity: raw.desiredQuantity ?? raw.DesiredQuantity,
    variations: raw.variations ?? raw.Variations,
    linkedItemIds: raw.linkedItemIds ?? raw.LinkedItemIds,
    otherUsersCanSee: raw.otherUsersCanSee ?? raw.OtherUsersCanSee,
    multiCount: raw.multiCount ?? raw.MultiCount,
    isFavorite: raw.isFavorite,
    isPinned: raw.isPinned,
  };
}

export function getCorePredefinedFromMetadata(
  metadata: ItemDescriptionMetadata | null | undefined
): Record<CorePredefinedFormKey, string> {
  const normalized = normalizeItemDescriptionMetadata(metadata);
  const result = {
    pantsSize: '',
    shirtSize: '',
    shoesSize: '',
    socksSize: '',
    color: '',
  } satisfies Record<CorePredefinedFormKey, string>;

  for (const formKey of CORE_PREDEFINED_FORM_KEYS) {
    const storageKey = toStoragePredefinedKey(formKey);
    const val = normalized.CustomFields?.Predefined?.[storageKey];
    if (typeof val === 'string' && val.trim()) {
      result[formKey] = val.trim();
    }
  }

  return result;
}

export function getCategoryPredefinedFromMetadata(
  metadata: ItemDescriptionMetadata | null | undefined,
  fieldKeys: string[]
): Record<string, string> {
  const normalized = normalizeItemDescriptionMetadata(metadata);
  const result: Record<string, string> = {};
  for (const key of fieldKeys) {
    const val = normalized.CustomFields?.Predefined?.[key];
    if (typeof val === 'string' && val.trim()) {
      result[key] = val.trim();
    }
  }
  return result;
}

export function getUserDefinedEntries(
  metadata: ItemDescriptionMetadata | null | undefined
): { name: string; value: string }[] {
  const normalized = normalizeItemDescriptionMetadata(metadata);
  return Object.entries(normalized.CustomFields?.UserDefined ?? {})
    .filter(([, value]) => value.trim())
    .map(([name, value]) => ({ name, value }));
}

export interface MetadataDisplayEntry {
  label: string;
  value: string;
}

export function getMetadataDisplayEntries(
  metadata: ItemDescriptionMetadata | null | undefined,
  categoryFieldLabels: Record<string, string> = {}
): MetadataDisplayEntry[] {
  const normalized = normalizeItemDescriptionMetadata(metadata);
  const entries: MetadataDisplayEntry[] = [];

  for (const [key, val] of Object.entries(normalized.CustomFields?.Predefined ?? {})) {
    if (val == null || !String(val).trim()) continue;
    const label = categoryFieldLabels[key] ?? formatPredefinedKeyToLabel(key);
    entries.push({ label, value: String(val).trim() });
  }

  for (const [name, value] of Object.entries(normalized.CustomFields?.UserDefined ?? {})) {
    if (value.trim()) {
      entries.push({ label: name, value: value.trim() });
    }
  }

  return entries;
}

export const METADATA_BADGE_EMOJI: Record<string, string> = {
  Pants: '👖',
  Shirt: '👕',
  Shoes: '👟',
  Socks: '🧦',
  Color: '🎨',
};

export function buildItemDescriptionPayload(input: {
  text: string;
  predefined: Record<string, string | null | undefined>;
  userDefined: Record<string, string>;
  desiredQuantity?: number;
  variations?: { name: string; quantity: number }[];
  linkedItemIds?: string[];
  otherUsersCanSee?: boolean;
  multiCount?: boolean;
  isFavorite?: boolean;
  isPinned?: boolean;
  alwaysJson?: boolean;
}): string {
  const predefinedClean: Record<string, string | null> = {};
  for (const [key, value] of Object.entries(input.predefined)) {
    if (value == null || !String(value).trim()) continue;
    predefinedClean[toStoragePredefinedKey(key)] = String(value).trim();
  }

  const userDefinedClean: Record<string, string> = {};
  for (const [key, value] of Object.entries(input.userDefined)) {
    if (key.trim() && value.trim()) {
      userDefinedClean[key.trim()] = value.trim();
    }
  }

  const hasCustomFields =
    Object.keys(predefinedClean).length > 0 || Object.keys(userDefinedClean).length > 0;

  const hasTopLevel =
    input.multiCount ||
    (input.linkedItemIds?.length ?? 0) > 0 ||
    input.isFavorite ||
    input.isPinned ||
    input.otherUsersCanSee === false ||
    (input.desiredQuantity ?? 1) !== 1 ||
    (input.variations?.length ?? 0) > 0;

  if (!hasCustomFields && !hasTopLevel && !input.text.trim()) {
    return '';
  }

  if (!input.alwaysJson && !hasCustomFields && !hasTopLevel) {
    return input.text.trim();
  }

  const payload: ItemDescriptionMetadata = {
    Text: input.text.trim() || null,
    CustomFields: {
      Predefined: predefinedClean,
      UserDefined: userDefinedClean,
    },
  };

  if (input.multiCount) payload.MultiCount = true;
  if (input.desiredQuantity !== undefined) payload.DesiredQuantity = input.desiredQuantity;
  if (input.variations?.length) payload.Variations = input.variations;
  if (input.linkedItemIds?.length) payload.LinkedItemIds = input.linkedItemIds;
  if (input.otherUsersCanSee !== undefined) payload.OtherUsersCanSee = input.otherUsersCanSee;
  if (input.isFavorite) payload.isFavorite = true;
  if (input.isPinned) payload.isPinned = true;

  return JSON.stringify(payload);
}

export function buildSummarizeCustomFields(input: {
  dynamicValues?: Record<string, string>;
  customFieldRows?: Array<{
    name: string;
    value: string;
    bucket?: 'predefined' | 'userDefined';
    storageKey?: string;
  }>;
}): ItemCustomFields {
  const predefined: Record<string, string | null> = {};

  for (const [key, value] of Object.entries(input.dynamicValues ?? {})) {
    if (value?.trim()) predefined[toStoragePredefinedKey(key)] = value.trim();
  }

  for (const row of input.customFieldRows ?? []) {
    if (!row.value?.trim()) continue;
    if (row.bucket === 'predefined' && row.storageKey?.trim()) {
      predefined[row.storageKey.trim()] = row.value.trim();
    }
  }

  const userDefined: Record<string, string> = {};
  for (const row of input.customFieldRows ?? []) {
    if (row.bucket === 'predefined') continue;
    if (row.name?.trim() && row.value?.trim()) {
      userDefined[row.name.trim()] = row.value.trim();
    }
  }

  return { Predefined: predefined, UserDefined: userDefined };
}

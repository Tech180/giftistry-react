import type {
  ItemCustomFields,
  ItemDescriptionMetadata,
  ItemDescriptionVariation,
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
  ShirtSize: 'shirtSize',
  ShoesSize: 'shoesSize',
  SocksSize: 'socksSize',
  Color: 'color',
};

const KNOWN_PREDEFINED_LABELS: Record<string, string> = {
  PantsSize: 'Pants Size',
  ShirtSize: 'Shirt Size',
  ShoesSize: 'Shoes Size',
  SocksSize: 'Socks Size',
  Color: 'Color',
  PreferredColor: 'Preferred Color',
  ModelNumber: 'Model Number',
  StorageCapacity: 'Storage Capacity',
};

export function formatPredefinedKeyToLabel(key: string): string {
  if (KNOWN_PREDEFINED_LABELS[key]) return KNOWN_PREDEFINED_LABELS[key];
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function normalizeVariations(raw: ItemDescriptionVariation[] | undefined): ItemDescriptionVariation[] | undefined {
  if (!raw?.length) return undefined;
  return raw
    .map((variation) => {
      const name = typeof variation.Name === 'string' ? variation.Name.trim() : '';
      const quantity = Number(variation.Quantity);
      return {
        Name: name,
        Quantity: Number.isFinite(quantity) ? quantity : 0,
      };
    })
    .filter((variation) => variation.Name.length > 0);
}

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
  return typeof metadata.Text === 'string' ? metadata.Text : '';
}

export function normalizeItemDescriptionMetadata(
  raw: ItemDescriptionMetadata | null | undefined
): ItemDescriptionMetadata {
  if (!raw) {
    return { Text: '', CustomFields: emptyCustomFields() };
  }

  return {
    Text: getMetadataText(raw),
    CustomFields: {
      Predefined: { ...(raw.CustomFields?.Predefined ?? {}) },
      UserDefined: { ...(raw.CustomFields?.UserDefined ?? {}) },
    },
    DesiredQuantity: raw.DesiredQuantity,
    Variations: normalizeVariations(raw.Variations),
    LinkedItemIds: raw.LinkedItemIds,
    RelatedItemIds: raw.RelatedItemIds,
    OtherUsersCanSee: raw.OtherUsersCanSee,
    MultiCount: raw.MultiCount,
    IsFavorite: raw.IsFavorite === true,
    IsPinned: raw.IsPinned === true,
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

export const METADATA_BADGE_EMOJI: Record<string, string> = {};

export function buildItemDescriptionPayload(input: {
  text: string;
  predefined: Record<string, string | null | undefined>;
  userDefined: Record<string, string>;
  desiredQuantity?: number;
  variations?: { name: string; quantity: number }[];
  linkedItemIds?: string[];
  relatedItemIds?: string[];
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
    (input.relatedItemIds?.length ?? 0) > 0 ||
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
  if (input.variations?.length) {
    payload.Variations = input.variations.map((variation) => ({
      Name: variation.name,
      Quantity: variation.quantity,
    }));
  }
  if (input.linkedItemIds?.length) payload.LinkedItemIds = input.linkedItemIds;
  if (input.relatedItemIds?.length) payload.RelatedItemIds = input.relatedItemIds;
  if (input.otherUsersCanSee !== undefined) payload.OtherUsersCanSee = input.otherUsersCanSee;
  if (input.isFavorite) payload.IsFavorite = true;
  if (input.isPinned) payload.IsPinned = true;

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

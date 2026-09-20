import { toStoragePredefinedKey } from 'shared/utils/item-custom-fields.util';

export function normalizeFieldKey(key: string): string {
  if (!key) {
    return key;
  }

  if (/^[a-z]/.test(key)) {
    return key;
  }

  return key.charAt(0).toLowerCase() + key.slice(1);
}

export function toStorageKey(key: string): string {
  return toStoragePredefinedKey(normalizeFieldKey(key));
}

export function normalizeLabel(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]/g, '');
}

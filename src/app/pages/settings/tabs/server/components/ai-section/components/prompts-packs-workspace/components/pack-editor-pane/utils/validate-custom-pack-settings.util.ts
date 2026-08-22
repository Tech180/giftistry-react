import { PACK_FIELD_KEY_PATTERN } from '../../../constants/custom-pack-id.constant';
import type { CustomPackSettings } from '../../../../metadata-packs/interfaces/custom-pack-settings.interface';

export function validateCustomPackSettings(pack: CustomPackSettings): string | null {
  if (!pack.Label.trim()) return 'Label is required.';
  const keys = new Set<string>();
  for (const field of pack.Fields) {
    if (!field.Key || !PACK_FIELD_KEY_PATTERN.test(field.Key)) {
      return 'Each field needs a letter-starting key such as Binding or PageCount.';
    }
    if (!field.Label.trim()) return 'Each field needs a label.';
    if (keys.has(field.Key)) return 'Field keys must be unique.';
    keys.add(field.Key);
  }
  return null;
}

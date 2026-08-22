import { CUSTOM_PACK_ID_PREFIX } from '../constants/custom-pack-id.constant';
import { slugifyPackLabel } from './slugify-pack-label.util';

export function allocateCustomPackId(label: string, takenIds: ReadonlySet<string>): string {
  const base = `${CUSTOM_PACK_ID_PREFIX}${slugifyPackLabel(label)}`;
  if (!takenIds.has(base)) return base;
  let suffix = 2;
  let candidate = `${base}-${suffix}`;
  while (takenIds.has(candidate)) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  return candidate;
}

import { CORE_LIBRARY_LABEL } from '../../metadata-packs/constants/core-library-label.constant';
import type { DirectoryPackRow } from '../../metadata-packs/interfaces/directory-pack-row.interface';
import { CUSTOM_LIBRARY_LABEL } from '../constants/custom-library-label.constant';

export function directoryPackCategoryLabel(pack: DirectoryPackRow): string {
  if (pack.IsCustom) return CUSTOM_LIBRARY_LABEL;
  if (pack.IsRoot) return CORE_LIBRARY_LABEL;
  return pack.ParentLabel ?? CORE_LIBRARY_LABEL;
}

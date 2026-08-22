import type { DirectoryPackRow } from '../../metadata-packs/interfaces/directory-pack-row.interface';
import type { DirectoryPackListItem } from '../interfaces/directory-pack-list-item.interface';
import { directoryPackCategoryLabel } from './directory-pack-category-label.util';
import { isTechnologyPack } from './is-technology-pack.util';

export function toDirectoryPackListItem(
  pack: DirectoryPackRow,
  enabledIds: ReadonlySet<string>
): DirectoryPackListItem {
  return {
    pack,
    enabled: enabledIds.has(pack.Id),
    categoryLabel: directoryPackCategoryLabel(pack),
    isTechnology: isTechnologyPack(pack.Id),
  };
}

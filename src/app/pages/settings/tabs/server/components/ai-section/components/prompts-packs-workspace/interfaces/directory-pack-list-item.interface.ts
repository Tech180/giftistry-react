import type { DirectoryPackRow } from '../../metadata-packs/interfaces/directory-pack-row.interface';

export interface DirectoryPackListItem {
  pack: DirectoryPackRow;
  enabled: boolean;
  categoryLabel: string;
  isTechnology: boolean;
}

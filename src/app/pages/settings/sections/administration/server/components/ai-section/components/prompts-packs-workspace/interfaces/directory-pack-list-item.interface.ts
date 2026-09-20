import type { DirectoryPackRow } from 'features/system';

export interface DirectoryPackListItem {
  pack: DirectoryPackRow;
  enabled: boolean;
  categoryLabel: string;
  isTechnology: boolean;
}

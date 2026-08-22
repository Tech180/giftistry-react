import type { DirectoryPackRow } from '../../../../metadata-packs/interfaces/directory-pack-row.interface';

export interface PackDirectoryRowProps {
  pack: DirectoryPackRow;
  enabled: boolean;
  categoryLabel: string;
  isTechnology: boolean;
  disabled: boolean;
  onView: () => void;
  onToggle: (enabled: boolean) => void;
}

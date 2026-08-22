import type { DirectoryPackRow } from '../../../../metadata-packs/interfaces/directory-pack-row.interface';

export interface PackDirectoryRowTemplateProps {
  pack: DirectoryPackRow;
  enabled: boolean;
  categoryLabel: string;
  isTechnology: boolean;
  disabled: boolean;
  viewAriaLabel: string;
  toggleAriaLabel: string;
  onView: () => void;
  onToggle: (enabled: boolean) => void;
}

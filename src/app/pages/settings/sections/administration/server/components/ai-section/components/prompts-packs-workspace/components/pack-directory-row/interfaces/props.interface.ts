import type { DirectoryPackRow } from 'features/system';

export interface PackDirectoryRowProps {
  pack: DirectoryPackRow;
  enabled: boolean;
  categoryLabel: string;
  isTechnology: boolean;
  disabled: boolean;
  onView: () => void;
  onToggle: (enabled: boolean) => void;
}

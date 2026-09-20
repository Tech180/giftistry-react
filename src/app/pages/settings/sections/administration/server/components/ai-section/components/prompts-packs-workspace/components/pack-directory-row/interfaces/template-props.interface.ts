import type { DirectoryPackRow } from 'features/system';

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

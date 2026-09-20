import type { DirectoryPackRow } from 'features/system';

export interface PackDetailPaneProps {
  pack: DirectoryPackRow;
  enabled: boolean;
  isTechnology: boolean;
  fragmentAriaLabel: string;
  disabled: boolean;
  onBack: () => void;
  onToggle: (enabled: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

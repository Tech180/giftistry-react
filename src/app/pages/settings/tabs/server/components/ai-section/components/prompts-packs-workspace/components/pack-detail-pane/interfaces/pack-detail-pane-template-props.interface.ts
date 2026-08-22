import type { DirectoryPackRow } from '../../../../metadata-packs/interfaces/directory-pack-row.interface';

export interface PackDetailPaneTemplateProps {
  pack: DirectoryPackRow;
  enabled: boolean;
  isTechnology: boolean;
  fragmentAriaLabel: string;
  toggleAriaLabel: string;
  disabled: boolean;
  isCustom: boolean;
  onBack: () => void;
  onToggle: (enabled: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

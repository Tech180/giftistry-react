import type { CustomPackSettings } from '../../../../metadata-packs/interfaces/custom-pack-settings.interface';
import type { PackEditorMode } from './pack-editor-mode.type';

export interface PackEditorPaneProps {
  mode: PackEditorMode;
  initialPack: CustomPackSettings;
  takenIds: readonly string[];
  disabled: boolean;
  onCancel: () => void;
  onApply: (pack: CustomPackSettings) => void;
  onDelete?: () => void;
}

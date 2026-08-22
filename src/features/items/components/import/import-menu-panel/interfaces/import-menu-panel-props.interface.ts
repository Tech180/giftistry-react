import type { ImportStripMode } from 'features/items/components/import/import-strip/interfaces/import-strip-props.interface';
import type { ImportFlowImported } from 'features/items/hooks/interfaces/import-flow-imported.interface';

export interface ImportMenuPanelProps {
  mode: ImportStripMode;
  listId?: string;
  allowAi: boolean;
  onClose: () => void;
  onSizeChange: (width: number, height: number) => void;
  onImported: (result: ImportFlowImported) => void;
  setPanelEscapeHandler: (handler: (() => boolean) | null) => void;
}

import type { Mode } from '../../strip/interfaces/mode.type';
import type { ImportFlowImported } from 'features/items/hooks/interfaces/import-flow-imported.interface';

export interface Props {
  mode: Mode;
  listId?: string;
  allowAi: boolean;
  onClose: () => void;
  onSizeChange: (width: number, height: number) => void;
  onImported: (result: ImportFlowImported) => void;
  setPanelEscapeHandler: (handler: (() => boolean) | null) => void;
}

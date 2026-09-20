import type { ImportFlowImported } from 'features/items/hooks/interfaces/import-flow-imported.interface';
import type { Mode } from './mode.type';

export interface Props {
  mode: Mode;
  listId?: string;
  isExpanded: boolean;
  onImported: (result: ImportFlowImported) => void;
  className?: string;
}

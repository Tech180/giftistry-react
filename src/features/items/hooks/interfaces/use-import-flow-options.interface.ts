import type { Mode } from 'features/items/components/import/strip/interfaces/mode.type';
import type { ImportFlowImported } from './import-flow-imported.interface';

export interface UseImportFlowOptions {
  mode: Mode;
  listId?: string;
  allowAi: boolean;
  onImported: (result: ImportFlowImported) => void;
}

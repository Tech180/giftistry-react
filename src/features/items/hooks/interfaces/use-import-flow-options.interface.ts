import type { ImportStripMode } from 'features/items/components/import/import-strip/interfaces/import-strip-props.interface';
import type { ImportFlowImported } from './import-flow-imported.interface';

export interface UseImportFlowOptions {
  mode: ImportStripMode;
  listId?: string;
  allowAi: boolean;
  onImported: (result: ImportFlowImported) => void;
}

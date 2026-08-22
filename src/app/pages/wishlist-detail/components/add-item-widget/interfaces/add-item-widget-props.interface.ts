import type { ItemEnrichJobResult } from 'features/jobs';

export interface AddItemWidgetProps {
  listId: string;
  isInputMode: boolean;
  canAutoAdd: boolean;
  onEnterInputMode: () => void;
  onExitInputMode: () => void;
  onManual: () => void;
  onStarted: (result: ItemEnrichJobResult) => void;
}

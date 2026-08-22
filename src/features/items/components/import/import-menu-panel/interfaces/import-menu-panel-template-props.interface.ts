import type { ImportStripMode } from 'features/items/components/import/import-strip/interfaces/import-strip-props.interface';
import type { ImportStripPhase } from 'features/items/components/import/import-strip/interfaces/import-strip-props.interface';

export interface ImportMenuPanelTemplateProps {
  mode: ImportStripMode;
  phase: ImportStripPhase;
  isDetails: boolean;
  allowAi: boolean;
  fileName: string | null;
  wishlistTitle: string;
  setWishlistTitle: (value: string) => void;
  errorMessage: string | null;
  isBusy: boolean;
  canConfirm: boolean;
  grabInfoArmed: boolean;
  optimizeCategoriesArmed: boolean;
  confirmLabel: string;
  confirmBusyLabel: string;
  onClose: () => void;
  onBack: () => void;
  onFileSelected: (file: File) => void;
  onConfirm: () => void;
  onGrabInfoChange: (checked: boolean) => void;
  onOptimizeCategoriesChange: (checked: boolean) => void;
}

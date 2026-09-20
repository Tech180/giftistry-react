import type { Mode } from '../../strip/interfaces/mode.type';
import type { Phase } from '../../strip/interfaces/phase.type';

export interface TemplateProps {
  mode: Mode;
  phase: Phase;
  isDetails: boolean;
  allowAi: boolean;
  fileName: string | null;
  wishlistTitle: string;
  setWishlistTitle: (value: string) => void;
  errorMessage: string | null;
  isBusy: boolean;
  grabInfoArmed: boolean;
  optimizeCategoriesArmed: boolean;
  confirmLabel: string;
  confirmBusyLabel: string;
  grabSwitchId: string;
  optimizeSwitchId: string;
  titleId: string;
  onClose: () => void;
  onBack: () => void;
  onFileSelected: (file: File) => void;
  onConfirm: () => void;
  onGrabInfoChange: (checked: boolean) => void;
  onOptimizeCategoriesChange: (checked: boolean) => void;
  aiPanelActive: boolean;
  confirmDisabled: boolean;
  confirmText: string;
  showReadingHint: boolean;
}

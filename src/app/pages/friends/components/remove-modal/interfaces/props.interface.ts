import type { RemoveTarget } from '../../../interfaces/remove-target.interface';

export interface Props {
  target: RemoveTarget | null;
  processingId: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

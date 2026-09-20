import type { ToastItem } from '../../../interfaces/item.interface';

export interface Props {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

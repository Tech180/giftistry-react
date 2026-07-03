import { ToastType } from './toast-type.interface';

export interface ToastProps {
  message: string;
  type?: ToastType;
  onDismiss?: () => void;
  className?: string;
}

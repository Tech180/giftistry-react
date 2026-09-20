export interface NotificationsProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

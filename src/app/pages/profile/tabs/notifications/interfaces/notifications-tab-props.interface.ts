export interface NotificationsTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

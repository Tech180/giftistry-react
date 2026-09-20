import type { ApiUser } from './api-user.interface';

export interface UseSecuritySettingsProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  requireStrongPasswords: boolean;
  refreshUser: () => Promise<void>;
  user: ApiUser | null;
}

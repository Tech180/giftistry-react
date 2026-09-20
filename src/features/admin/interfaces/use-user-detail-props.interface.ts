import type { SessionUser } from './session-user.interface';
import type { ShowToast } from './show-toast.type';

export interface UseUserDetailProps {
  showToast: ShowToast;
  userId: string | undefined;
  currentUser: SessionUser | null;
  refreshUser: () => Promise<void>;
}

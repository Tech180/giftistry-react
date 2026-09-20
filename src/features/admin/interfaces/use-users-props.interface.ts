import type { SessionUser } from './session-user.interface';
import type { ShowToast } from './show-toast.type';

export interface UseUsersProps {
  showToast: ShowToast;
  currentUser: SessionUser | null;
}

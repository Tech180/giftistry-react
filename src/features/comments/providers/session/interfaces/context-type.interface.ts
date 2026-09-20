import type { ApiUser } from 'features/auth';

export interface CommentsSessionContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
}

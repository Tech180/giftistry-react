import type { ApiUser } from 'features/auth';

export interface ItemsSessionContextType {
  user: ApiUser | null;
  canShowAi: boolean;
}

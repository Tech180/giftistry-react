import type { ApiUser } from 'features/auth';

export interface WishlistSessionContextType {
  user: ApiUser | null;
  canShowAi: boolean;
  canShowWebSearch: boolean;
}

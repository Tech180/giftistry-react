import { ApiUser } from 'features/auth';

export interface AuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (username?: string, firstName?: string, lastName?: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

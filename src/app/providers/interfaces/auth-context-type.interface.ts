import { ApiUser } from 'features/auth';

export interface AuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (username: string, email: string, password: string, firstName?: string, lastName?: string) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (
    username?: string,
    firstName?: string,
    lastName?: string,
    bio?: string,
    theme?: string,
    avatar?: string | null,
    aiEnabled?: boolean
  ) => Promise<ApiUser | null>;
  updateAiEnabled: (aiEnabled: boolean) => Promise<ApiUser | null>;
  error: string | null;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  isSystemInitialized: boolean;
  globalAiEnabled: boolean;
  canShowAi: boolean;
  canShowAiSettings: boolean;
  registrationMode: 'open' | 'invite_only' | 'disabled';
  maintenanceMode: boolean;
  maintenanceMessage: string;
  checkSystemStatus: () => Promise<void>;
}

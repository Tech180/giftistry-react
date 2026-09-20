import type { ApiUser } from 'features/auth';

export interface PageTemplateProps {
  user: ApiUser | null;
  isLoading: boolean;
  error: string | null;
  isDisabled: boolean;
  displayName: string;
  userInitials: string;
  joinedLabel: string;
  statusText: string;
  isOnline: boolean;
  onBack: () => void;
  onTryTheme: (themeId: string) => void;
}

import type { SubmitEvent } from 'react';
import type { PublicLinkPreview } from 'features/wishlists';

export interface PageTemplateProps {
  isLoading: boolean;
  error: string | null;
  inviteError: string | null;
  password: string;
  isSubmitting: boolean;
  isSuccess: boolean;
  listId: string | null;
  isAuthenticated: boolean;
  guestPreview: PublicLinkPreview | null;
  homeLabel: string;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
  onViewWishlist: () => void;
  onGoHome: () => void;
}

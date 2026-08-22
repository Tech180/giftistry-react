import type { FormEvent } from 'react';
import type { PublicLinkPreview } from 'features/wishlists/interfaces/public-link-preview.interface';

export interface InviteAcceptPageTemplateProps {
  isLoading: boolean;
  error: string | null;
  inviteError: string | null;
  password: string;
  setPassword: (value: string) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  listId: string | null;
  isAuthenticated: boolean;
  guestPreview: PublicLinkPreview | null;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleViewWishlist: () => void;
  handleGoDashboard: () => void;
}

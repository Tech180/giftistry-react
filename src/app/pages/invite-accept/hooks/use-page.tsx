import { useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from 'features/auth';
import { notificationsApi } from 'features/notifications';
import type { PublicLinkPreview } from 'features/wishlists';
import {
  FAILED_ACCEPT_INVITE,
  FAILED_OPEN_WISHLIST,
  FAILED_RETRIEVE_DETAILS,
  INVALID_INVITE_LINK,
} from '../constants/fallback-messages.constant';
import type { UsePageResult } from '../interfaces/use-page-result.interface';
import { normalizePreview } from '../utils/normalize-preview.util';

export function usePage(): UsePageResult {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [listId, setListId] = useState<string | null>(null);
  const [guestPreview, setGuestPreview] = useState<PublicLinkPreview | null>(null);

  useEffect(() => {
    if (!token || isAuthLoading) {
      if (!token) {
        setError(INVALID_INVITE_LINK);
        setIsLoading(false);
      }
      return;
    }

    const loadDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const details = await notificationsApi.getInviteLinkDetails(token);

        if (details.PasswordProtected) return;

        if (isAuthenticated) {
          const result = await notificationsApi.acceptListInvite(token);
          if (result.ListId) setListId(result.ListId);
          setIsSuccess(true);
          return;
        }

        const preview = await notificationsApi.getPublicLinkPreview(token);
        setGuestPreview(normalizePreview(preview));
      } catch (err) {
        setError(err instanceof Error ? err.message : FAILED_RETRIEVE_DETAILS);
      } finally {
        setIsLoading(false);
      }
    };

    void loadDetails();
  }, [token, isAuthenticated, isAuthLoading]);

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    setInviteError(null);

    try {
      if (isAuthenticated) {
        const result = await notificationsApi.acceptListInvite(token, password);
        if (result.ListId) setListId(result.ListId);
        setIsSuccess(true);
        return;
      }

      const preview = await notificationsApi.postPublicLinkPreview(token, password);
      setGuestPreview(normalizePreview(preview));
    } catch (err) {
      const fallback = isAuthenticated ? FAILED_ACCEPT_INVITE : FAILED_OPEN_WISHLIST;
      setInviteError(err instanceof Error ? err.message : fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isLoading: isLoading || isAuthLoading,
    error,
    inviteError,
    password,
    isSubmitting,
    isSuccess,
    listId,
    isAuthenticated,
    guestPreview,
    homeLabel: isAuthenticated ? 'Back to Dashboard' : 'Log in',
    onPasswordChange: setPassword,
    onSubmit,
    onViewWishlist: () => {
      if (listId) navigate(`/wishlists/${listId}`);
    },
    onGoHome: () => navigate(isAuthenticated ? '/dashboard' : '/login'),
  };
}

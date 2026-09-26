import { useCallback, useEffect, useRef, useState } from 'react';
import type { SubmitEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from 'core/api/api-error';
import { useAuth } from 'features/auth';
import { notificationsApi, useGuestInviteSocket } from 'features/notifications';
import type { PublicLinkPreview } from 'features/wishlists';
import {
  FAILED_ACCEPT_INVITE,
  FAILED_OPEN_WISHLIST,
  FAILED_RETRIEVE_DETAILS,
  INVALID_INVITE_LINK,
} from '../constants/fallback-messages.constant';
import { GUEST_PREVIEW_REFRESH_DEBOUNCE_MS } from '../constants/guest-preview-refresh.constant';
import type { UsePageResult } from '../interfaces/use-page-result.interface';
import { normalizePreview } from '../utils/normalize-preview.util';
import { useGuestPreviewRefresh } from './use-guest-preview-refresh';

const LINK_REVOKED_MESSAGE =
  'This share link is no longer available. Ask the owner for a new link.';

export function usePage(): UsePageResult {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [previewRefreshError, setPreviewRefreshError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [listId, setListId] = useState<string | null>(null);
  const [guestPreview, setGuestPreview] = useState<PublicLinkPreview | null>(null);
  const previewPasswordRef = useRef<string | null>(null);
  const isPasswordProtectedRef = useRef(false);
  const listChangedTimerRef = useRef<number | null>(null);

  const reloadGuestPreview = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!token) {
        return;
      }

      const silent = options?.silent === true;
      try {
        const preview = isPasswordProtectedRef.current
          ? await notificationsApi.postPublicLinkPreview(
              token,
              previewPasswordRef.current ?? ''
            )
          : await notificationsApi.getPublicLinkPreview(token);
        setGuestPreview(normalizePreview(preview));
        if (!silent) {
          setPreviewRefreshError(null);
        }
      } catch (err) {
        const status = err instanceof ApiError ? err.status : 0;
        if (status === 401 || status === 403 || status === 404) {
          setPreviewRefreshError(
            err instanceof Error ? err.message : LINK_REVOKED_MESSAGE
          );
          return;
        }
        if (!silent) {
          throw err;
        }
      }
    },
    [token]
  );

  const reloadGuestPreviewSilent = useCallback(async () => {
    await reloadGuestPreview({ silent: true });
  }, [reloadGuestPreview]);

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
        isPasswordProtectedRef.current = details.PasswordProtected;

        if (details.PasswordProtected) return;

        if (isAuthenticated) {
          const result = await notificationsApi.acceptListInvite(token);
          if (result.ListId) setListId(result.ListId);
          setIsSuccess(true);
          return;
        }

        await reloadGuestPreview({ silent: false });
      } catch (err) {
        setError(err instanceof Error ? err.message : FAILED_RETRIEVE_DETAILS);
      } finally {
        setIsLoading(false);
      }
    };

    void loadDetails();
  }, [token, isAuthenticated, isAuthLoading, reloadGuestPreview]);

  useEffect(() => {
    if (!guestPreview) {
      previewPasswordRef.current = null;
    }
  }, [guestPreview]);

  useGuestPreviewRefresh({
    enabled: !!guestPreview && !!token,
    reload: reloadGuestPreviewSilent,
  });

  const scheduleSocketReload = useCallback(() => {
    if (listChangedTimerRef.current !== null) {
      window.clearTimeout(listChangedTimerRef.current);
    }
    listChangedTimerRef.current = window.setTimeout(() => {
      listChangedTimerRef.current = null;
      void reloadGuestPreviewSilent();
    }, GUEST_PREVIEW_REFRESH_DEBOUNCE_MS);
  }, [reloadGuestPreviewSilent]);

  useEffect(() => {
    return () => {
      if (listChangedTimerRef.current !== null) {
        window.clearTimeout(listChangedTimerRef.current);
      }
    };
  }, []);

  useGuestInviteSocket({
    enabled:
      !!guestPreview &&
      !!token &&
      guestPreview.SupportsGuestRealtime === true &&
      (!isPasswordProtectedRef.current || !!previewPasswordRef.current),
    token,
    password: previewPasswordRef.current,
    onListChanged: scheduleSocketReload,
    onRevoked: () => {
      setPreviewRefreshError(LINK_REVOKED_MESSAGE);
    },
  });

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

      isPasswordProtectedRef.current = true;
      previewPasswordRef.current = password;
      const preview = await notificationsApi.postPublicLinkPreview(token, password);
      setGuestPreview(normalizePreview(preview));
      setPreviewRefreshError(null);
    } catch (err) {
      previewPasswordRef.current = null;
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
    previewRefreshError,
    password,
    isSubmitting,
    isSuccess,
    listId,
    isAuthenticated,
    guestPreview,
    homeLabel: isAuthenticated ? 'Back to Dashboard' : 'Log in',
    onPasswordChange: setPassword,
    onSubmit,
    onDismissPreviewRefreshError: () => setPreviewRefreshError(null),
    onViewWishlist: () => {
      if (listId) navigate(`/wishlists/${listId}`);
    },
    onGoHome: () => navigate(isAuthenticated ? '/dashboard' : '/login'),
  };
}

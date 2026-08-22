import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notificationsApi } from 'features/notifications';
import { useAuth } from 'app/providers/auth-context';
import type { PublicLinkPreview } from 'features/wishlists';
import { normalizeGuestPreviewItem } from 'features/wishlists/utils/normalize-guest-preview-item.util';
import { InviteAcceptPageTemplate } from './invite-accept-page.html';

export default function InviteAcceptPage() {
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
        setError('Invalid invite link.');
        setIsLoading(false);
      }
      return;
    }

    const loadDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const details = await notificationsApi.getInviteLinkDetails(token);

        if (details.PasswordProtected) {
          return;
        }

        if (isAuthenticated) {
          const result = await notificationsApi.acceptListInvite(token);
          if (result.ListId) {
            setListId(result.ListId);
          }
          setIsSuccess(true);
          return;
        }

        const preview = await notificationsApi.getPublicLinkPreview(token);
        setGuestPreview({
          ...preview,
          Items: (preview.Items ?? []).map(normalizeGuestPreviewItem),
          Groups: (preview.Groups ?? []).map((group) => ({
            ...group,
            Items: (group.Items ?? []).map(normalizeGuestPreviewItem),
          })),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to retrieve invite details.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadDetails();
  }, [token, isAuthenticated, isAuthLoading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    setInviteError(null);

    try {
      if (isAuthenticated) {
        const result = await notificationsApi.acceptListInvite(token, password);
        if (result.ListId) {
          setListId(result.ListId);
        }
        setIsSuccess(true);
      } else {
        const preview = await notificationsApi.postPublicLinkPreview(token, password);
        setGuestPreview({
          ...preview,
          Items: (preview.Items ?? []).map(normalizeGuestPreviewItem),
          Groups: (preview.Groups ?? []).map((group) => ({
            ...group,
            Items: (group.Items ?? []).map(normalizeGuestPreviewItem),
          })),
        });
      }
    } catch (err) {
      setInviteError(
        err instanceof Error
          ? err.message
          : isAuthenticated
            ? 'Failed to accept invite.'
            : 'Failed to open wishlist.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <InviteAcceptPageTemplate
      isLoading={isLoading || isAuthLoading}
      error={error}
      inviteError={inviteError}
      password={password}
      setPassword={setPassword}
      isSubmitting={isSubmitting}
      isSuccess={isSuccess}
      listId={listId}
      isAuthenticated={isAuthenticated}
      guestPreview={guestPreview}
      handleSubmit={handleSubmit}
      handleViewWishlist={() => {
        if (listId) navigate(`/wishlists/${listId}`);
      }}
      handleGoDashboard={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
    />
  );
}

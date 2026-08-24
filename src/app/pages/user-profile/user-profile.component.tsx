import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authApi, type ApiUser } from 'features/auth';
import { useTheme } from 'app/providers/theme-context';
import { resolveOnlineStatus } from 'shared/utils/resolve-online-status.util';
import {
  getFallbackInitials,
  getJoinedDate,
  getUserInitials,
} from 'shared/ui/user-preview-card/utils/user-preview-card.utils';
import { UserProfileTemplate } from './user-profile.html';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { tryTheme } = useTheme();

  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('User not found.');
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authApi.getUserPreview(userId);
        if (cancelled) return;
        if (!res?.User) {
          setUser(null);
          setError('User not found.');
          return;
        }
        setUser(res.User);
      } catch (err) {
        if (cancelled) return;
        setUser(null);
        setError(err instanceof Error ? err.message : 'Failed to load profile.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const isDisabled = !!user?.IsDisabled;
  const displayName =
    user?.FirstName || user?.LastName
      ? `${user.FirstName ?? ''} ${user.LastName ?? ''}`.trim()
      : user?.Username || 'User';
  const userInitials = user ? getUserInitials(user) : getFallbackInitials(displayName);
  const joinedDate = user?.CreatedAt ? getJoinedDate(user.CreatedAt) : 'Unknown';
  const status = resolveOnlineStatus(user?.LastOnline, false);

  return (
    <UserProfileTemplate
      user={user}
      isLoading={isLoading}
      error={error}
      isDisabled={isDisabled}
      displayName={displayName}
      userInitials={userInitials}
      joinedDate={joinedDate}
      statusText={status.statusText}
      isOnline={status.isOnline}
      onBack={() => navigate(-1)}
      onTryTheme={(themeId) => {
        if (user?.Username) {
          tryTheme(themeId, user.Username);
        }
      }}
    />
  );
}

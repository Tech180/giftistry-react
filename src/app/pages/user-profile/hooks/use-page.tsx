import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from 'app/providers/theme';
import {
  authApi,
  type ApiUser,
  getFallbackInitials,
  getJoinedDate,
  getUserInitials,
} from 'features/auth';
import { resolveOnlineStatus } from 'shared/utils/resolve-online-status.util';
import type { PageTemplateProps } from '../interfaces/page-template-props.interface';
import { getDisplayName } from 'shared/utils/get-display-name.util';
import { getJoinedLabel } from '../utils/get-joined-label.util';

export function usePage(): PageTemplateProps {
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
        if (cancelled) {
          return;
        }

        if (!res?.User) {
          setUser(null);
          setError('User not found.');
          return;
        }

        setUser(res.User);
      } catch (err) {
        if (cancelled) {
          return;
        }

        setUser(null);
        setError(err instanceof Error ? err.message : 'Failed to load profile.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const isDisabled = !!user?.IsDisabled;
  const displayName = getDisplayName(user);
  const userInitials = user ? getUserInitials(user) : getFallbackInitials(displayName);
  const joinedLabel = getJoinedLabel(user?.CreatedAt ? getJoinedDate(user.CreatedAt) : 'Unknown');
  const status = resolveOnlineStatus(user?.LastOnline, false);

  return {
    user,
    isLoading,
    error,
    isDisabled,
    displayName,
    userInitials,
    joinedLabel,
    statusText: status.statusText,
    isOnline: status.isOnline,
    onBack: () => navigate(-1),
    onTryTheme: (themeId) => {
      if (user?.Username) {
        tryTheme(themeId, user.Username);
      }
    },
  };
}

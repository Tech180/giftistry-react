import { useCallback, useState } from 'react';
import type { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import { sanitizeRestrictedUserIds } from '../../../utils/item-audience.util';
import type { UseAudienceResult } from '../interfaces/use-audience-result.interface';

export function useAudience(options: { listShares: ListShare[] }): UseAudienceResult {
  const { listShares } = options;
  const [sharedWithUserIds, setSharedWithUserIds] = useState<string[]>([]);
  const [visibilityMode, setVisibilityMode] = useState<'everyone' | 'restricted' | 'private'>(
    'everyone'
  );

  const handleVisibilityModeChange = useCallback(
    (mode: 'everyone' | 'restricted' | 'private') => {
      setVisibilityMode(mode);
      setSharedWithUserIds((prev) => {
        if (mode === 'everyone' || mode === 'private') {
          return [];
        }
        return sanitizeRestrictedUserIds(
          prev,
          listShares.map((share) => share.UserId)
        );
      });
    },
    [listShares]
  );

  return {
    sharedWithUserIds,
    setSharedWithUserIds,
    visibilityMode,
    setVisibilityMode,
    handleVisibilityModeChange,
  };
}

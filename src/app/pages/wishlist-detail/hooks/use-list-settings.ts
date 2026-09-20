import { useCallback, useMemo } from 'react';
import {
  wishlistsApi,
  type Wishlist,
  dateInputToExpiresAtIso,
  expiresAtIsoToDateInput,
  isWishlistArchived,
} from 'features/wishlists';
import { useToast } from 'shared/providers/toast';
import type { UseListSettingsOptions } from '../interfaces/use-list-settings-options.interface';
import type { UseListSettingsResult } from '../interfaces/use-list-settings-result.interface';

async function patchWishlist(
  wishlist: Wishlist,
  patch: Partial<{
    title: string;
    expiresAt: string | null;
    allowGroupFunds: boolean;
    aiEnabled: boolean;
    webSearchEnabled: boolean;
    manualJobBackground: boolean;
    autoRollover: boolean;
  }>
): Promise<Wishlist> {
  return wishlistsApi.updateWishlist(
    wishlist.Id,
    patch.title ?? wishlist.Title,
    patch.expiresAt !== undefined
      ? patch.expiresAt
      : wishlist.ExpiresAt
        ? new Date(wishlist.ExpiresAt).toISOString()
        : null,
    patch.allowGroupFunds ?? wishlist.AllowGroupFunds,
    wishlist.Category,
    undefined,
    patch.aiEnabled ?? wishlist.AiEnabled,
    patch.webSearchEnabled ?? wishlist.WebSearchEnabled,
    patch.manualJobBackground ?? wishlist.ManualJobBackground !== false,
    patch.autoRollover ?? wishlist.AutoRollover === true
  );
}

export function useListSettings({
  wishlist,
  setWishlist,
  canShowWebSearch,
}: UseListSettingsOptions): UseListSettingsResult {
  const { showToast } = useToast();

  const saveTitle = useCallback(
    async (newTitle: string) => {
      if (!wishlist) {
        return;
      }

      const trimmed = newTitle.trim();
      if (!trimmed || trimmed === wishlist.Title) {
        return;
      }

      try {
        const updated = await patchWishlist(wishlist, { title: trimmed });
        setWishlist(updated);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to update title');
        throw err;
      }
    },
    [wishlist, setWishlist]
  );

  const saveDate = useCallback(
    async (newDateStr: string) => {
      if (!wishlist) {
        return;
      }

      const prevDateStr = expiresAtIsoToDateInput(wishlist.ExpiresAt);
      if (newDateStr === prevDateStr) {
        return;
      }

      const wasArchived = isWishlistArchived(wishlist.IsActive);
      try {
        const expiresAtIso = dateInputToExpiresAtIso(newDateStr);
        const updated = await patchWishlist(wishlist, { expiresAt: expiresAtIso });
        setWishlist(updated);
        if (wasArchived) {
          showToast('Date updated. Restore the list to unlock it.', 'info');
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to update date');
        throw err;
      }
    },
    [wishlist, setWishlist, showToast]
  );

  const toggleAiEnabled = useCallback(async () => {
    if (!wishlist) {
      return;
    }

    try {
      const updated = await patchWishlist(wishlist, { aiEnabled: !wishlist.AiEnabled });
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle AI reviews');
    }
  }, [wishlist, setWishlist]);

  const toggleWebSearchEnabled = useCallback(async () => {
    if (!wishlist) {
      return;
    }

    try {
      const updated = await patchWishlist(wishlist, {
        webSearchEnabled: !wishlist.WebSearchEnabled,
      });
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle web search');
    }
  }, [wishlist, setWishlist]);

  const toggleManualJobBackground = useCallback(async () => {
    if (!wishlist) {
      return;
    }

    try {
      const updated = await patchWishlist(wishlist, {
        manualJobBackground: wishlist.ManualJobBackground === false,
      });
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle background enrich');
    }
  }, [wishlist, setWishlist]);

  const toggleAutoRollover = useCallback(async () => {
    if (!wishlist) {
      return;
    }

    try {
      const updated = await patchWishlist(wishlist, {
        autoRollover: wishlist.AutoRollover !== true,
      });
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle rollover');
    }
  }, [wishlist, setWishlist]);

  const toggleAllowGroupFunds = useCallback(async () => {
    if (!wishlist) {
      return;
    }

    try {
      const updated = await patchWishlist(wishlist, {
        allowGroupFunds: !wishlist.AllowGroupFunds,
      });
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle group funding');
    }
  }, [wishlist, setWishlist]);

  const canUseWebSearchOnList = useMemo(
    () => Boolean(canShowWebSearch && wishlist?.AiEnabled && wishlist?.WebSearchEnabled),
    [canShowWebSearch, wishlist]
  );

  return {
    saveTitle,
    saveDate,
    toggleAiEnabled,
    toggleWebSearchEnabled,
    toggleManualJobBackground,
    toggleAutoRollover,
    toggleAllowGroupFunds,
    canUseWebSearchOnList,
  };
}

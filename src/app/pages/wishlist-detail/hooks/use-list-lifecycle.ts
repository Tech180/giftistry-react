import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wishlistsApi } from 'features/wishlists';
import { useToast } from 'shared/providers/toast';
import type { ConfirmAction } from '../interfaces/confirm-action.type';
import type { UseListLifecycleOptions } from '../interfaces/use-list-lifecycle-options.interface';
import type { UseListLifecycleResult } from '../interfaces/use-list-lifecycle-result.interface';

export function useListLifecycle({ wishlist }: UseListLifecycleOptions): UseListLifecycleResult {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleDeactivateConfirm = useCallback(async () => {
    if (!wishlist) {
      return;
    }

    setIsDeactivating(true);
    setConfirmAction(null);
    try {
      await wishlistsApi.deactivateWishlist(wishlist.Id);
      navigate('/dashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Deactivation failed.');
    } finally {
      setIsDeactivating(false);
    }
  }, [wishlist, navigate]);

  const handleActivateConfirm = useCallback(async () => {
    if (!wishlist) {
      return;
    }

    setIsActivating(true);
    setConfirmAction(null);
    try {
      await wishlistsApi.activateWishlist(wishlist.Id);
      navigate('/dashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Reactivation failed.');
    } finally {
      setIsActivating(false);
    }
  }, [wishlist, navigate]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!wishlist) {
      return;
    }

    setIsDeleting(true);
    setConfirmAction(null);
    try {
      await wishlistsApi.deleteWishlist(wishlist.Id);
      navigate('/dashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Deletion failed.');
    } finally {
      setIsDeleting(false);
    }
  }, [wishlist, navigate]);

  const handleDuplicate = useCallback(async () => {
    if (!wishlist || isDuplicating) {
      return;
    }

    setIsDuplicating(true);
    setConfirmAction(null);
    try {
      await wishlistsApi.duplicateWishlist(wishlist.Id);
      showToast(
        'This list has been duplicated.\nPlease head back to the dashboard to check out your new list.',
        'success'
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Duplication failed.', 'error');
    } finally {
      setIsDuplicating(false);
    }
  }, [wishlist, isDuplicating, showToast]);

  return {
    confirmAction,
    setConfirmAction,
    isDeactivating,
    isActivating,
    isDeleting,
    isDuplicating,
    handleDeactivateConfirm,
    handleActivateConfirm,
    handleDeleteConfirm,
    handleDuplicate,
  };
}

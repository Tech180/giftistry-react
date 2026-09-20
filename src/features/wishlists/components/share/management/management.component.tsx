import React, { useEffect, useState } from 'react';
import { wishlistsApi } from 'features/wishlists/api/wishlists.api';
import { getDisplayName } from 'shared/utils/get-display-name.util';
import { useShares } from '../../../hooks/use-shares';
import {
  COLLABORATOR_TO_VIEWER_WARNING_DESCRIPTION,
  COLLABORATOR_TO_VIEWER_WARNING_PROCEED_PROMPT,
  COLLABORATOR_TO_VIEWER_WARNING_TITLE,
} from './constants/collaborator-to-viewer-warning.constant';
import { Props } from './interfaces/props.interface';
import { ShareManagementTemplate } from './management.html';
import { shouldConfirmCollaboratorToViewer } from './utils/should-confirm-collaborator-to-viewer.util';

export const ShareManagement: React.FC<Props> = ({
  listId,
  isOwner,
  variant = 'classic',
  ownerInfo,
  onCautionModeChange,
}) => {
  const { shares, isLoading, error, setError, loadShares } = useShares(listId);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [pendingDemotionShareId, setPendingDemotionShareId] = useState<string | null>(null);

  useEffect(() => {
    onCautionModeChange?.(pendingDemotionShareId !== null);
    return () => onCautionModeChange?.(false);
  }, [pendingDemotionShareId, onCautionModeChange]);

  const applyRoleChange = async (shareId: string, role: 'viewer' | 'collaborator') => {
    setUpdatingId(shareId);
    try {
      await wishlistsApi.updateShare(listId, shareId, role);
      await loadShares();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (shareId: string, role: 'viewer' | 'collaborator') => {
    const current = shares.find((share) => share.Id === shareId);
    if (current && shouldConfirmCollaboratorToViewer(current.Role, role)) {
      setPendingDemotionShareId(shareId);
      return;
    }

    await applyRoleChange(shareId, role);
  };

  const handleCancelDemotion = () => {
    setPendingDemotionShareId(null);
  };

  const handleConfirmDemotion = async () => {
    if (!pendingDemotionShareId) {
      return;
    }
    const shareId = pendingDemotionShareId;
    setUpdatingId(shareId);
    setError(null);
    try {
      await wishlistsApi.updateShare(listId, shareId, 'viewer');
      setPendingDemotionShareId(null);
      await loadShares();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (shareId: string) => {
    setRemovingId(shareId);
    try {
      await wishlistsApi.removeShare(listId, shareId);
      await loadShares();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke access.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <ShareManagementTemplate
      variant = {
        variant
      }
      ownerInfo = {
        ownerInfo
      }
      shares = {
        shares
      }
      isOwner = {
        isOwner
      }
      isLoading = {
        isLoading
      }
      error = {
        error
      }
      updatingId = {
        updatingId
      }
      removingId = {
        removingId
      }
      pendingDemotionShareId = {
        pendingDemotionShareId
      }
      cautionTitle = {
        COLLABORATOR_TO_VIEWER_WARNING_TITLE
      }
      cautionDescription = {
        COLLABORATOR_TO_VIEWER_WARNING_DESCRIPTION
      }
      cautionProceedPrompt = {
        COLLABORATOR_TO_VIEWER_WARNING_PROCEED_PROMPT
      }
      onRoleChange = {
        handleRoleChange
      }
      onRemove = {
        handleRemove
      }
      onConfirmDemotion = {
        handleConfirmDemotion
      }
      onCancelDemotion = {
        handleCancelDemotion
      }
      getDisplayName = {
        getDisplayName
      }
    />
  );
};

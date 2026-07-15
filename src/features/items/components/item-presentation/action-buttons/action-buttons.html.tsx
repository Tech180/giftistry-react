import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from 'shared/ui';
import { ActionButtonsProps } from './interfaces/action-buttons-props.interface';
import styles from './action-buttons.module.css';

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isOwner,
  canCollaborate,
  claimedByCurrentUser,
  isFullyClaimed,
  claimLoading,
  showDeleteConfirm,
  deleteLoading,
  onEdit,
  onClaim,
  onUnclaim,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  compact = false,
}) => {
  const size = compact ? 'sm' : 'sm';

  if (isOwner && canCollaborate) {
    const stackClass = compact ? styles['actions-row'] : styles['actions-stack'];

    return (
      <div className={stackClass}>
        <Button
          variant="ghost"
          size={size}
          iconOnly
          onClick={onEdit}
          aria-label="Edit item"
          title="Edit item"
        >
          <Pencil size={14} />
        </Button>
        {showDeleteConfirm ? (
          <div className={compact ? styles['actions-row'] : styles['actions-stack']}>
            <Button variant="primary" size={size} onClick={onDeleteConfirm} isLoading={deleteLoading}>
              Confirm
            </Button>
            <Button variant="ghost" size={size} onClick={onDeleteCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size={size}
            iconOnly
            onClick={onDeleteRequest}
            aria-label="Delete item"
            title="Delete item"
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>
    );
  }

  if (isOwner) return null;

  if (claimedByCurrentUser) {
    return (
      <Button variant="secondary" size={size} onClick={onUnclaim} isLoading={claimLoading}>
        Unclaim
      </Button>
    );
  }

  if (isFullyClaimed) {
    return (
      <Button variant="secondary" size={size} disabled>
        Claimed
      </Button>
    );
  }

  return (
    <Button variant="primary" size={size} onClick={onClaim} isLoading={claimLoading}>
      Claim Item
    </Button>
  );
};

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from 'shared/ui';
import { ActionButtonsTemplateProps } from './interfaces/action-buttons-template-props.interface';
import styles from './action-buttons.module.css';

export const ActionButtonsTemplate: React.FC<ActionButtonsTemplateProps> = ({
  layoutMode,
  size,
  stackClassName,
  confirmClassName,
  claimLoading,
  showDeleteConfirm,
  deleteLoading,
  onEdit,
  onClaim,
  onUnclaim,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
}) => {
  if (layoutMode === 'owner-edit') {
    return (
      <div className={stackClassName}>
        <Button
          variant="ghost"
          size={size}
          iconOnly
          onClick={onEdit}
          aria-label="Edit item"
          title="Edit item"
          className={styles['claim-icon-btn']}
        >
          <Pencil size={16} />
        </Button>
        {showDeleteConfirm ? (
          <div className={confirmClassName}>
            <Button
              variant="primary"
              size={size}
              onClick={onDeleteConfirm}
              isLoading={deleteLoading}
              className={styles['claim-action-btn']}
            >
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
            className={styles['claim-icon-btn']}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    );
  }

  if (layoutMode === 'unclaim') {
    return (
      <Button
        variant="secondary"
        size={size}
        onClick={onUnclaim}
        isLoading={claimLoading}
        className={styles['claim-action-btn']}
      >
        Unclaim
      </Button>
    );
  }

  if (layoutMode === 'claimed') {
    return (
      <Button variant="secondary" size={size} disabled className={styles['claim-action-btn']}>
        Claimed
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size={size}
      onClick={onClaim}
      isLoading={claimLoading}
      className={styles['claim-action-btn']}
    >
      Claim
    </Button>
  );
};

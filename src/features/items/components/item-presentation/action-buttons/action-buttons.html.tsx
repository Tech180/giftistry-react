import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from 'shared/ui';
import { ClaimButton } from '../substitution/claim-button/claim-button.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './action-buttons.module.css';

export const ActionButtonsTemplate: React.FC<TemplateProps> = ({
  stackClassName,
  confirmClassName,
  iconBtnClassName,
  claimsClusterClassName,
  size,
  claimButtonSize,
  bareClaimOnly,
  showLeading,
  showView,
  showEditor,
  showSubstitution,
  claimPanel,
  claimLabel,
  claimVariant,
  claimDisabled,
  claimClassName,
  claimOnClick,
  claimShowsLoading,
  updateUnclaimClassName,
  updateUnclaimDisabled,
  claimLoading,
  showDeleteConfirm,
  deleteLoading,
  substitutionAction,
  substitutionDisabled,
  substitutionClassName,
  onEdit,
  onView,
  onClaim,
  onUnclaim,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
}) => {
  const viewButton = showView && onView ? (
    <Button
      variant="ghost"
      size={size}
      iconOnly
      onClick={onView}
      aria-label="View item"
      title="View Item"
      className={iconBtnClassName}
    >
      <Eye size={16} />
    </Button>
  ) : null;

  const editorButtons = showEditor ? (
    <div className={styles['action-buttons__editor']}>
      <Button
        variant="ghost"
        size={size}
        iconOnly
        onClick={onEdit}
        aria-label="Edit item"
        title="Edit item"
        className={iconBtnClassName}
      >
        <Pencil size={16} />
      </Button>
      {showDeleteConfirm ? (
        <div className={confirmClassName}>
          <Button
            variant="danger"
            size={size}
            onClick={onDeleteConfirm}
            isLoading={deleteLoading}
            className={styles['action-buttons__action-btn']}
          >
            Confirm
          </Button>
          <Button
            variant="ghost"
            size={size}
            onClick={onDeleteCancel}
            className={styles['action-buttons__action-btn']}
          >
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
          className={iconBtnClassName}
        >
          <Trash2 size={16} />
        </Button>
      )}
    </div>
  ) : null;

  const substitutionControl =
    showSubstitution && substitutionAction ? (
      <ClaimButton
        mode={substitutionAction.mode}
        allowSubstitutions={substitutionAction.allowSubstitutions}
        onOpenEditor={substitutionAction.onRequest}
        onDelete={substitutionAction.onDelete}
        appearance="ghost-text"
        size={claimButtonSize}
        disabled={substitutionDisabled}
        className={substitutionClassName}
      />
    ) : null;

  let claimControl: React.ReactNode = null;
  if (claimPanel === 'simple') {
    claimControl = (
      <Button
        variant={claimVariant}
        size={size}
        onClick={claimOnClick}
        isLoading={claimShowsLoading ? claimLoading : false}
        disabled={claimDisabled}
        className={claimClassName}
      >
        {claimLabel}
      </Button>
    );
  } else if (claimPanel === 'update') {
    claimControl = (
      <div className={updateUnclaimClassName}>
        <Button
          variant="ghost"
          size={size}
          onClick={onUnclaim}
          isLoading={claimLoading}
          disabled={updateUnclaimDisabled}
          className={`${styles['action-buttons__action-btn']} ${styles['action-buttons__action-btn--unclaim-all']}`}
        >
          Unclaim All
        </Button>
        <Button
          variant="secondary"
          size={size}
          onClick={onClaim}
          className={styles['action-buttons__action-btn']}
        >
          Update Claim
        </Button>
      </div>
    );
  }

  if (bareClaimOnly) {
    return <>{claimControl}</>;
  }

  const claimsBody =
    showSubstitution && claimControl ? (
      <div className={claimsClusterClassName}>
        {substitutionControl}
        {claimControl}
      </div>
    ) : showSubstitution ? (
      <div className={claimsClusterClassName}>{substitutionControl}</div>
    ) : (
      claimControl
    );

  return (
    <div className={stackClassName}>
      {showLeading ? (
        <div className={styles['action-buttons__leading']}>
          {viewButton}
          {editorButtons}
        </div>
      ) : null}
      {claimsBody}
    </div>
  );
};

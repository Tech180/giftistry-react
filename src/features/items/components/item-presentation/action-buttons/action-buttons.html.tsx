import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from 'shared/ui';
import { ActionButtonsTemplateProps } from './interfaces/action-buttons-template-props.interface';
import { SubstitutionClaimButton } from '../substitution/claim-button/claim-button.component';
import styles from './action-buttons.module.css';

function ViewAction({
  size,
  onView,
}: {
  size: ActionButtonsTemplateProps['size'];
  onView: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size={size}
      iconOnly
      onClick={onView}
      aria-label="View item"
      title="View Item"
      className={styles['claim-icon-btn']}
    >
      <Eye size={16} />
    </Button>
  );
}

function EditorActions({
  size,
  confirmClassName,
  showDeleteConfirm,
  deleteLoading,
  onEdit,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  grouped = false,
}: Pick<
  ActionButtonsTemplateProps,
  | 'size'
  | 'confirmClassName'
  | 'showDeleteConfirm'
  | 'deleteLoading'
  | 'onEdit'
  | 'onDeleteRequest'
  | 'onDeleteConfirm'
  | 'onDeleteCancel'
> & { grouped?: boolean }) {
  const actions = (
    <>
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
            variant="danger"
            size={size}
            onClick={onDeleteConfirm}
            isLoading={deleteLoading}
            className={styles['claim-action-btn']}
          >
            Confirm
          </Button>
          <Button variant="ghost" size={size} onClick={onDeleteCancel} className={styles['claim-action-btn']}>
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
    </>
  );

  if (grouped) {
    return <div className={styles['editor-actions']}>{actions}</div>;
  }
  return actions;
}

function SubstitutionAction({
  size,
  substitutionAction,
  disabled,
}: {
  size: ActionButtonsTemplateProps['size'];
  substitutionAction: NonNullable<ActionButtonsTemplateProps['substitutionAction']>;
  disabled: boolean;
}) {
  return (
    <SubstitutionClaimButton
      mode={substitutionAction.mode}
      allowSubstitutions={substitutionAction.allowSubstitutions}
      onOpenEditor={substitutionAction.onRequest}
      onDelete={substitutionAction.onDelete}
      appearance="ghost-text"
      size={size === 'sm' ? 'sm' : 'md'}
      disabled={disabled}
      className={
        substitutionAction.mode === 'manage' ? styles['claim-icon-btn'] : undefined
      }
    />
  );
}

function ClaimActionsCluster({
  substitutionControl,
  claimControl,
}: {
  substitutionControl: React.ReactNode;
  claimControl: React.ReactNode;
}) {
  if (!substitutionControl) {
    return <>{claimControl}</>;
  }
  return (
    <div className={styles['claim-actions']}>
      {substitutionControl}
      {claimControl}
    </div>
  );
}

export const ActionButtonsTemplate: React.FC<ActionButtonsTemplateProps> = ({
  layoutMode,
  size,
  stackClassName,
  confirmClassName,
  claimLoading,
  showDeleteConfirm,
  deleteLoading,
  showSuggesterEditActions,
  onEdit,
  onView,
  onClaim,
  onUnclaim,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  unclaimDisabled,
  hasLinkedUnclaimPeers = false,
  substitutionAction = null,
}) => {
  const viewAction = onView ? <ViewAction size={size} onView={onView} /> : null;
  const substitutionControl = substitutionAction ? (
    <SubstitutionAction
      size={size}
      substitutionAction={substitutionAction}
      disabled={claimLoading || unclaimDisabled || showDeleteConfirm}
    />
  ) : null;

  if (layoutMode == null) {
    return viewAction ? (
      <div className={stackClassName}>
        <div className={styles['leading-actions']}>{viewAction}</div>
      </div>
    ) : null;
  }

  const editorActions = showSuggesterEditActions ? (
    <EditorActions
      size={size}
      confirmClassName={confirmClassName}
      showDeleteConfirm={showDeleteConfirm}
      deleteLoading={deleteLoading}
      onEdit={onEdit}
      onDeleteRequest={onDeleteRequest}
      onDeleteConfirm={onDeleteConfirm}
      onDeleteCancel={onDeleteCancel}
      grouped
    />
  ) : null;

  const leadingActions =
    viewAction || editorActions ? (
      <div className={styles['leading-actions']}>
        {viewAction}
        {editorActions}
      </div>
    ) : null;

  if (layoutMode === 'owner-edit') {
    return (
      <div className={stackClassName}>
        <div className={styles['leading-actions']}>
          {viewAction}
          <EditorActions
            size={size}
            confirmClassName={confirmClassName}
            showDeleteConfirm={showDeleteConfirm}
            deleteLoading={deleteLoading}
            onEdit={onEdit}
            onDeleteRequest={onDeleteRequest}
            onDeleteConfirm={onDeleteConfirm}
            onDeleteCancel={onDeleteCancel}
            grouped
          />
        </div>
      </div>
    );
  }

  if (layoutMode === 'unclaim') {
    const claimControl = (
      <Button
        variant="secondary"
        size={size}
        onClick={onUnclaim}
        isLoading={claimLoading}
        disabled={unclaimDisabled}
        className={styles['claim-action-btn']}
      >
        Unclaim{hasLinkedUnclaimPeers ? ' all' : ''}
      </Button>
    );
    if (!leadingActions && !substitutionControl) {
      return claimControl;
    }
    return (
      <div className={stackClassName}>
        {leadingActions}
        <ClaimActionsCluster
          substitutionControl={substitutionControl}
          claimControl={claimControl}
        />
      </div>
    );
  }

  if (layoutMode === 'claimed' || layoutMode === 'unavailable') {
    const claimControl = (
      <Button variant="secondary" size={size} disabled className={styles['claim-action-btn']}>
        {layoutMode === 'unavailable' ? 'Unavailable' : 'Claimed'}
      </Button>
    );
    if (!leadingActions && !substitutionControl) {
      return claimControl;
    }
    return (
      <div className={stackClassName}>
        {leadingActions}
        <ClaimActionsCluster
          substitutionControl={substitutionControl}
          claimControl={claimControl}
        />
      </div>
    );
  }

  if (layoutMode === 'update-claim') {
    const claimControl = (
      <div className={styles['actions-update']}>
        <Button
          variant="ghost"
          size={size}
          onClick={onUnclaim}
          isLoading={claimLoading}
          disabled={unclaimDisabled}
          className={`${styles['claim-action-btn']} ${styles['unclaim-all-btn']}`}
        >
          Unclaim All
        </Button>
        <Button
          variant="secondary"
          size={size}
          onClick={onClaim}
          className={styles['claim-action-btn']}
        >
          Update Claim
        </Button>
      </div>
    );
    if (!leadingActions && !substitutionControl) {
      return claimControl;
    }
    return (
      <div className={stackClassName}>
        {leadingActions}
        <ClaimActionsCluster
          substitutionControl={substitutionControl}
          claimControl={claimControl}
        />
      </div>
    );
  }

  const claimControl = (
    <Button
      variant="primary"
      size={size}
      onClick={onClaim}
      isLoading={claimLoading}
      className={styles['claim-action-btn']}
    >
      Claim Item
    </Button>
  );
  if (!leadingActions && !substitutionControl) {
    return claimControl;
  }
  return (
    <div className={stackClassName}>
      {leadingActions}
      <ClaimActionsCluster
        substitutionControl={substitutionControl}
        claimControl={claimControl}
      />
    </div>
  );
};

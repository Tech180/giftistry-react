import React, { useState } from 'react';
import { Button, Modal } from 'shared/ui';
import {
  ADD_CUSTOM_SUBSTITUTION_MODAL_TITLE,
  ADD_SUBSTITUTION_ACTION_LABEL,
  DELETE_SUBSTITUTION_ACTION_LABEL,
  EDIT_SUBSTITUTION_ACTION_LABEL,
  SUBSTITUTION_DISABLED_WARNING,
} from '../../../../constants/substitution-messages.constant';
import type { SubstitutionClaimButtonProps } from './interfaces/substitution-claim-button-props.interface';
import { SubstitutionClaimButtonTemplate } from './claim-button.html';
import styles from './claim-button.module.css';

export type { SubstitutionClaimButtonProps } from './interfaces/substitution-claim-button-props.interface';

export const SubstitutionClaimButton: React.FC<SubstitutionClaimButtonProps> = ({
  allowSubstitutions,
  mode = 'create',
  disabled = false,
  appearance = 'secondary',
  size = 'sm',
  className,
  onOpenEditor,
  onDelete,
}) => {
  const [showDisabledConfirm, setShowDisabledConfirm] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const createLabel =
    appearance === 'ghost-text'
      ? ADD_SUBSTITUTION_ACTION_LABEL
      : ADD_CUSTOM_SUBSTITUTION_MODAL_TITLE;

  const openEditor = () => {
    setShowDisabledConfirm(false);
    setWarningOpen(false);
    onOpenEditor();
  };

  const handleRequest = () => {
    if (mode === 'manage' || allowSubstitutions) {
      openEditor();
      return;
    }
    setShowDisabledConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    setDeleteBusy(true);
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <>
      <SubstitutionClaimButtonTemplate
        mode={mode}
        allowSubstitutions={allowSubstitutions}
        showDisabledConfirm={showDisabledConfirm}
        showDeleteConfirm={showDeleteConfirm}
        disabled={disabled}
        busy={deleteBusy}
        appearance={appearance}
        size={size}
        className={className}
        createLabel={createLabel}
        editLabel={EDIT_SUBSTITUTION_ACTION_LABEL}
        deleteLabel={DELETE_SUBSTITUTION_ACTION_LABEL}
        onRequest={handleRequest}
        onDisabledConfirm={() => setWarningOpen(true)}
        onDisabledCancel={() => setShowDisabledConfirm(false)}
        onDeleteRequest={() => setShowDeleteConfirm(true)}
        onDeleteConfirm={() => {
          void handleDeleteConfirm();
        }}
        onDeleteCancel={() => setShowDeleteConfirm(false)}
      />

      <Modal
        isOpen={warningOpen}
        onClose={() => setWarningOpen(false)}
        title="Substitutions disabled"
      >
        <div className={styles['warning-body']}>
          <p className={styles['warning-text']}>{SUBSTITUTION_DISABLED_WARNING}</p>
          <div className={styles['warning-actions']}>
            <Button variant="ghost" onClick={() => setWarningOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={openEditor}>
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

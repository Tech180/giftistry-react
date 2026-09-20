import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button, Modal } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './claim-button.module.css';

export const ClaimButtonTemplate: React.FC<TemplateProps> = ({
  mode,
  allowSubstitutions,
  showDisabledConfirm,
  showDeleteConfirm,
  warningOpen,
  disabled = false,
  busy = false,
  appearance = 'secondary',
  size = 'sm',
  className,
  createLabel,
  editLabel,
  deleteLabel,
  warningText,
  onRequest,
  onDisabledConfirm,
  onDisabledCancel,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  onWarningClose,
  onWarningContinue,
}) => {
  const isGhostText = appearance === 'ghost-text';

  let body: React.ReactNode;

  if (mode === 'manage') {
    if (showDeleteConfirm) {
      body = (
        <div className={styles.confirm}>
          <Button
            type="button"
            variant="danger"
            size={size}
            disabled={disabled || busy}
            onClick={onDeleteConfirm}
            isLoading={busy}
          >
            Confirm
          </Button>
          <Button
            type="button"
            variant="ghost"
            size={size}
            onClick={onDeleteCancel}
            disabled={busy}
          >
            Cancel
          </Button>
        </div>
      );
    } else {
      body = (
        <div className={styles.manage}>
          <Button
            type="button"
            variant={isGhostText ? 'ghost' : 'secondary'}
            size={size}
            iconOnly
            disabled={disabled || busy}
            onClick={onRequest}
            aria-label={editLabel}
            title={editLabel}
            className={className}
          >
            <Pencil size={16} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size={size}
            iconOnly
            disabled={disabled || busy}
            onClick={onDeleteRequest}
            aria-label={deleteLabel}
            title={deleteLabel}
            className={[styles['delete-btn'], className].filter(Boolean).join(' ')}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      );
    }
  } else if (allowSubstitutions) {
    body = (
      <Button
        type="button"
        variant={isGhostText ? 'ghost' : 'secondary'}
        size={size}
        disabled={disabled || busy}
        onClick={onRequest}
        aria-label={createLabel}
        className={className}
      >
        {createLabel}
      </Button>
    );
  } else if (showDisabledConfirm) {
    body = (
      <div className={styles.confirm}>
        <Button
          type="button"
          variant="danger"
          size={size}
          disabled={disabled || busy}
          onClick={onDisabledConfirm}
        >
          Continue anyway
        </Button>
        <Button type="button" variant="ghost" size={size} onClick={onDisabledCancel} disabled={busy}>
          Cancel
        </Button>
      </div>
    );
  } else {
    body = (
      <div className={styles.wrap}>
        <Button
          type="button"
          variant={isGhostText ? 'ghost' : 'secondary'}
          size={size}
          disabled={disabled || busy}
          onClick={onRequest}
          aria-label={createLabel}
          className={className}
        >
          {createLabel}
        </Button>
      </div>
    );
  }

  return (
    <>
      {body}
      <Modal isOpen={warningOpen} onClose={onWarningClose} title="Substitutions disabled">
        <div className={styles['warning-body']}>
          <p className={styles['warning-text']}>{warningText}</p>
          <div className={styles['warning-actions']}>
            <Button variant="ghost" onClick={onWarningClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onWarningContinue}>
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

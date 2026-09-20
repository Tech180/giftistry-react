import React from 'react';
import { Button, Modal } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './remove-modal.module.css';

export const RemoveModalTemplate: React.FC<TemplateProps> = ({
  target,
  processingId,
  onClose,
  onConfirm,
}) => {
  const isRemoving = !!target && processingId === target.id;

  return (
    <Modal
      isOpen = {
        !!target
      }
      onClose = {
        onClose
      }
      title = {
        'Remove Friend'
      }
      subtitle = {
        'This action cannot be undone.'
      }
    >
      {target ? (
        <>
          <p className={styles['remove-modal__body']}>
            Are you sure you want to remove{' '}
            <strong className={styles['remove-modal__name']}>{target.name}</strong> from
            your friends list? This will also remove you from their friends list.
          </p>
          <div className={styles['remove-modal__actions']}>
            <Button
              variant = {
                'ghost'
              }
              onClick = {
                onClose
              }
              disabled = {
                isRemoving
              }
            >
              Cancel
            </Button>
            <Button
              variant = {
                'danger'
              }
              onClick = {
                onConfirm
              }
              disabled = {
                isRemoving
              }
            >
              {isRemoving ? 'Removing...' : 'Remove Friend'}
            </Button>
          </div>
        </>
      ) : null}
    </Modal>
  );
};

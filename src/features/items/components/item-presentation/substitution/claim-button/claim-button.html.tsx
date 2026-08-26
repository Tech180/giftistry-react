import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from 'shared/ui';
import type { SubstitutionClaimButtonTemplateProps } from './interfaces/substitution-claim-button-template-props.interface';
import styles from './claim-button.module.css';

export const SubstitutionClaimButtonTemplate: React.FC<
  SubstitutionClaimButtonTemplateProps
> = ({
  mode,
  allowSubstitutions,
  showDisabledConfirm,
  showDeleteConfirm,
  disabled = false,
  busy = false,
  appearance = 'secondary',
  size = 'sm',
  className,
  createLabel,
  editLabel,
  deleteLabel,
  onRequest,
  onDisabledConfirm,
  onDisabledCancel,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
}) => {
  const isGhostText = appearance === 'ghost-text';

  if (mode === 'manage') {
    if (showDeleteConfirm) {
      return (
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
    }

    return (
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

  const trigger = (
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

  if (allowSubstitutions) {
    return trigger;
  }

  if (showDisabledConfirm) {
    return (
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
  }

  return <div className={styles.wrap}>{trigger}</div>;
};

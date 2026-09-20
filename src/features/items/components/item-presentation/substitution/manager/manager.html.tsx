import React from 'react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, Switch } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './manager.module.css';

export const ManagerTemplate: React.FC<TemplateProps> = ({
  allowSubstitutions,
  onAllowSubstitutionsChange,
  ownerOptions,
  canAddMore,
  disabled = false,
  hasParentItem,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onMoveUp,
  onMoveDown,
  busy = false,
}) => {
  return (
    <section className={styles.manager} aria-label="Substitutions">
      <div className={styles['manager__header']}>
        <div className={styles['manager__title']}>Substitutions</div>
        <div className={styles['manager__switch-row']}>
          <label htmlFor="allow-substitutions" className={styles['manager__switch-label']}>
            Allow substitutions
          </label>
          <Switch
            id="allow-substitutions"
            checked={allowSubstitutions}
            onChange={onAllowSubstitutionsChange}
            size="sm"
            disabled={disabled}
            aria-label="Allow substitutions"
          />
        </div>
        {allowSubstitutions ? (
          <div className={styles['manager__action-row']}>
            <p className={styles['manager__action-hint']}>
              Add owner-approved alternatives. Claimers can still add one custom option.
              {!hasParentItem ? ' Save the item first to add approved substitutions.' : ''}
            </p>
            <button
              type="button"
              className={styles['manager__action-btn']}
              disabled={disabled || busy || !canAddMore || !hasParentItem}
              onClick={onAddClick}
              title="Add approved substitution"
              aria-label="Add approved substitution"
            >
              <Plus size={16} />
              {ownerOptions.length > 0 && (
                <span className={styles['manager__action-badge']}>{ownerOptions.length}</span>
              )}
            </button>
          </div>
        ) : (
          <p className={styles['manager__hint']}>
            Add owner-approved alternatives. Claimers can still add one custom option after a
            warning when this is off.
          </p>
        )}
      </div>

      {allowSubstitutions ? (
        <>
          {ownerOptions.length > 0 && (
            <ul className={styles['manager__list']}>
              {ownerOptions.map((option, index) => (
                <li key={option.Id} className={styles['manager__row']}>
                  <span className={styles['manager__row-name']}>
                    <span className={styles['manager__row-name-text']}>{option.Item.Name}</span>
                  </span>
                  <div className={styles['manager__row-actions']}>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      disabled={disabled || busy || index === 0}
                      onClick={() => onMoveUp(option)}
                      aria-label="Move up"
                    >
                      <ChevronUp size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      disabled={disabled || busy || index === ownerOptions.length - 1}
                      onClick={() => onMoveDown(option)}
                      aria-label="Move down"
                    >
                      <ChevronDown size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      disabled={disabled || busy || !hasParentItem}
                      onClick={() => onEditClick(option)}
                      aria-label="Edit substitution"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      disabled={disabled || busy || !hasParentItem}
                      onClick={() => onDeleteClick(option)}
                      aria-label="Delete substitution"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </section>
  );
};

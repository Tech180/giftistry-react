import React from 'react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, Switch } from 'shared/ui';
import type { SubstitutionManagerTemplateProps } from './interfaces/substitution-manager-template-props.interface';
import styles from './manager.module.css';

export const SubstitutionManagerTemplate: React.FC<SubstitutionManagerTemplateProps> = ({
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
      <div className={styles.header}>
        <div className={styles.title}>Substitutions</div>
        <div className={styles['switch-row']}>
          <label htmlFor="allow-substitutions" className={styles['switch-label']}>
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
          <div className={styles['action-row']}>
            <p className={styles['action-hint']}>
              Add owner-approved alternatives. Claimers can still add one custom option.
              {!hasParentItem ? ' Save the item first to add approved substitutions.' : ''}
            </p>
            <button
              type="button"
              className={styles['action-btn']}
              disabled={disabled || busy || !canAddMore || !hasParentItem}
              onClick={onAddClick}
              title="Add approved substitution"
              aria-label="Add approved substitution"
            >
              <Plus size={16} />
              {ownerOptions.length > 0 && (
                <span className={styles['action-badge']}>{ownerOptions.length}</span>
              )}
            </button>
          </div>
        ) : (
          <p className={styles.hint}>
            Add owner-approved alternatives. Claimers can still add one custom option after a
            warning when this is off.
          </p>
        )}
      </div>

      {allowSubstitutions ? (
        <>
          {ownerOptions.length > 0 && (
            <ul className={styles.list}>
              {ownerOptions.map((option, index) => (
                <li key={option.Id} className={styles.row}>
                  <span className={styles['row-name']}>
                    <span className={styles['row-name-text']}>{option.Item.Name}</span>
                  </span>
                  <div className={styles['row-actions']}>
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

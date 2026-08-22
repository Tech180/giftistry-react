import React from 'react';
import { Button, Switch } from 'shared/ui';
import { PackCategoryIcon } from '../pack-category-icon/pack-category-icon.component';
import type { PackDirectoryRowTemplateProps } from './interfaces/pack-directory-row-template-props.interface';
import styles from './pack-directory-row.module.css';

export const PackDirectoryRowTemplate: React.FC<PackDirectoryRowTemplateProps> = ({
  pack,
  enabled,
  categoryLabel,
  isTechnology,
  disabled,
  viewAriaLabel,
  toggleAriaLabel,
  onView,
  onToggle,
}) => {
  return (
    <div className={styles['pack-row']}>
      <div className={styles['pack-icon']}>
        <PackCategoryIcon isTechnology={isTechnology} />
      </div>
      <div className={styles['pack-info']}>
        <div className={styles['pack-title-row']}>
          <h4 className={styles['pack-title']}>{pack.Label}</h4>
          <span className={styles['pack-category']}>{categoryLabel}</span>
        </div>
        <p className={styles['pack-desc']}>{pack.Description}</p>
      </div>
      <div className={styles['pack-actions']}>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          aria-label={viewAriaLabel}
          disabled={disabled}
          onClick={onView}
        >
          View
        </Button>
        <Switch
          size="sm"
          checked={enabled}
          disabled={disabled}
          aria-label={toggleAriaLabel}
          onChange={onToggle}
        />
      </div>
    </div>
  );
};

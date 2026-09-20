import React from 'react';
import { Button } from 'shared/ui';
import { PaginationControlsTemplateProps } from './interfaces/pagination-controls-template-props.interface';
import shared from '../../shared.module.css';
import styles from './pagination-controls.module.css';

export const PaginationControlsTemplate: React.FC<PaginationControlsTemplateProps> = ({
  page,
  totalPages,
  onPageChange,
}) => (
  <div className={shared['admin__actions']}>
    <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
      Previous
    </Button>
    <span className={styles['pagination-controls__label']}>
      Page {page} of {totalPages}
    </span>
    <Button
      variant="secondary"
      disabled={page >= totalPages}
      onClick={() => onPageChange(page + 1)}
    >
      Next
    </Button>
  </div>
);

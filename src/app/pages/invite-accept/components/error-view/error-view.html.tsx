import React from 'react';
import { Button, ErrorState } from 'shared/ui';
import type { ErrorViewTemplateProps } from './interfaces/error-view-template-props.interface';
import styles from './error-view.module.css';

export const ErrorViewTemplate: React.FC<ErrorViewTemplateProps> = ({
  message,
  homeLabel,
  onGoHome,
}) => (
  <>
    <ErrorState message={message} />
    <Button
      type="button"
      variant="secondary"
      className={styles['error-view__action']}
      onClick={onGoHome}
    >
      {homeLabel}
    </Button>
  </>
);

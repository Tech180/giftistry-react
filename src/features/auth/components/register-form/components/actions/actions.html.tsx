import React from 'react';
import { Button } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './actions.module.css';

export const ActionsTemplate: React.FC<TemplateProps> = ({
  isLoading,
  disabled,
  oauthEnabled,
  onOauthSignup,
}) => {
  return (
    <div className={styles.actions}>
      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        disabled={disabled}
        className={styles['submit-btn']}
      >
        Create Account
      </Button>

      {oauthEnabled && (
        <Button
          type="button"
          variant="secondary"
          className={styles['submit-btn']}
          onClick={onOauthSignup}
          disabled={disabled}
        >
          Sign in with SSO
        </Button>
      )}
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Card, EnterPanel } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './register-form.module.css';

export const RegisterFormTemplate: React.FC<TemplateProps> = ({
  inviteValidating,
  registrationClosed,
  registrationClosedMessage,
  localError,
  handleSubmit,
  fields,
  actions,
}) => {
  return (
    <EnterPanel animation="scale">
      <Card className={styles.card} padding="lg" glass={true}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Get started with your custom gift registry</p>
        </div>

        {inviteValidating && (
          <EnterPanel animation="slide-up" className={styles.alert}>
            <AlertCircle size={16} />
            <span>Checking invite link…</span>
          </EnterPanel>
        )}

        {registrationClosed && registrationClosedMessage && !inviteValidating && (
          <EnterPanel animation="slide-up" className={styles.alert}>
            <AlertCircle size={16} />
            <span>{registrationClosedMessage}</span>
          </EnterPanel>
        )}

        {localError && (
          <EnterPanel animation="slide-up" className={styles.alert}>
            <AlertCircle size={16} />
            <span>{localError}</span>
          </EnterPanel>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {fields}
          {actions}
        </form>

        <div className={styles.footer}>
          <span>Already have an account?</span>{' '}
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>
        </div>
      </Card>
    </EnterPanel>
  );
};

import React from 'react';
import { Button, Input } from 'shared/ui';
import type { PasswordFormTemplateProps } from './interfaces/password-form-template-props.interface';
import styles from './password-form.module.css';

export const PasswordFormTemplate: React.FC<PasswordFormTemplateProps> = ({
  password,
  inviteError,
  isSubmitting,
  submitLabel,
  onPasswordChange,
  onSubmit,
  onCancel,
}) => (
  <div className={styles['password-form__card']}>
    <h1 className={styles['password-form__title']}>Password Required</h1>
    <p className={styles['password-form__message']}>
      This wishlist share link is password-protected.
    </p>

    <form onSubmit={onSubmit} className={styles['password-form__form']}>
      <Input
        id="invite-password"
        type="password"
        label="Enter Link Password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder="••••••••"
        disabled={isSubmitting}
        required
        error={inviteError ?? undefined}
      />
      <div className={styles['password-form__actions']}>
        <Button type="submit" variant="primary" disabled={isSubmitting || !password}>
          {submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  </div>
);

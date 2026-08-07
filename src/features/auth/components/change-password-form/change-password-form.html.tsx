import React from 'react';
import { AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { Input, Button, Card, EnterPanel } from 'shared/ui';
import { ChangePasswordFormTemplateProps } from '../../interfaces/change-password-form-template-props.interface';
import styles from './change-password-form.module.css';

export const ChangePasswordFormTemplate: React.FC<ChangePasswordFormTemplateProps> = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showCurrent,
  showNew,
  showConfirm,
  onToggleShowCurrent,
  onToggleShowNew,
  onToggleShowConfirm,
  isLoading,
  localError,
  handleSubmit,
  passwordHint,
}) => (
  <EnterPanel animation="scale">
    <Card className={styles.card} padding="lg" glass>
      <div className={styles.header}>
        <h1 className={styles.title}>Update your password</h1>
        <p className={styles.subtitle}>
          For security, choose a new password before continuing.
        </p>
      </div>

      {localError && (
        <EnterPanel animation="slide-up" className={styles.alert}>
          <AlertCircle size={16} />
          <span>{localError}</span>
        </EnterPanel>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Current password *"
          type={showCurrent ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={onToggleShowCurrent}
              aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
            >
              {showCurrent ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          }
          rightIconClickable
          required
        />

        <Input
          label="New password *"
          type={showNew ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={onToggleShowNew}
              aria-label={showNew ? 'Hide new password' : 'Show new password'}
            >
              {showNew ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          }
          rightIconClickable
          required
        />

        <Input
          label="Confirm new password *"
          type={showConfirm ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={onToggleShowConfirm}
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          }
          rightIconClickable
          required
        />

        <p className={styles.hint}>{passwordHint}</p>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className={styles['submit-btn']}
        >
          Save new password
        </Button>
      </form>
    </Card>
  </EnterPanel>
);

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { PasswordSectionProps } from '../interfaces/password-section-props.interface';
import styles from './password-section.module.css';

export const PasswordSectionTemplate: React.FC<PasswordSectionProps> = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  showCurrent,
  setShowCurrent,
  showNew,
  setShowNew,
  showConfirm,
  setShowConfirm,
  handleUpdatePassword,
}) => {
  return (
    <section className={styles.section}>
      <h2 className={styles['section-header']}>Password</h2>
      <form onSubmit={handleUpdatePassword} className={styles['setting-list']}>
        <div className={styles['form-grid']}>
          <div className={styles['input-wrapper']}>
            <label className={styles['input-label']}>Current password</label>
            <div className={styles['input-box']}>
              <input
                type={showCurrent ? 'text' : 'password'}
                className={styles['input-field']}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles['input-icon-btn']}
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className={styles['password-fields-grid']}>
            <div className={styles['input-wrapper']}>
              <label className={styles['input-label']}>New password</label>
              <div className={styles['input-box']}>
                <input
                  type={showNew ? 'text' : 'password'}
                  className={styles['input-field']}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className={styles['input-icon-btn']}
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className={styles['input-wrapper']}>
              <label className={styles['input-label']}>Confirm password</label>
              <div className={styles['input-box']}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={styles['input-field']}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className={styles['input-icon-btn']}
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles['setting-row']} ${styles['password-submit-row']}`}>
          <button
            type="submit"
            className={`${styles.btn} ${styles['btn-secondary']} ${styles['password-submit-btn']}`}
            disabled={isLoading}
          >
            {isLoading && <span className={styles.spinner} />}
            {isLoading ? 'Updating...' : 'Update password'}
          </button>
        </div>
      </form>
    </section>
  );
};

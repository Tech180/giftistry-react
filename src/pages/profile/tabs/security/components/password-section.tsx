import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { PasswordSectionProps } from '../interfaces/password-section-props.interface';
import styles from '../security-tab.module.css';

export const PasswordSection: React.FC<PasswordSectionProps> = ({
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
      <h2 className={styles.sectionHeader}>Password</h2>
      <form onSubmit={handleUpdatePassword} className={styles.settingList}>
        <div className={styles.formGrid}>
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel}>Current password</label>
            <div className={styles.inputBox}>
              <input
                type={showCurrent ? 'text' : 'password'}
                className={styles.inputField}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.inputIconBtn}
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className={styles.passwordFieldsGrid}>
            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>New password</label>
              <div className={styles.inputBox}>
                <input
                  type={showNew ? 'text' : 'password'}
                  className={styles.inputField}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className={styles.inputIconBtn}
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.inputLabel}>Confirm password</label>
              <div className={styles.inputBox}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={styles.inputField}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className={styles.inputIconBtn}
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.settingRow} ${styles.passwordSubmitRow}`}>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnSecondary} ${styles.passwordSubmitBtn}`}
            disabled={isLoading}
          >
            {isLoading && <span className={styles.spinner}></span>}
            {isLoading ? 'Updating...' : 'Update password'}
          </button>
        </div>
      </form>
    </section>
  );
};

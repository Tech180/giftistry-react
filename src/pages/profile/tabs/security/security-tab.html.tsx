import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { SecurityTabTemplateProps } from './interfaces/security-tab-template-props.interface';
import styles from './security-tab.module.css';

export const SecurityTabTemplate: React.FC<SecurityTabTemplateProps> = ({
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
    <div className={styles.tabPane}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Password & Security</h2>
        <p className={styles.pageSubtitle}>Manage your account password and security options.</p>
      </div>

      <div className={`${styles.glassCard} ${styles.securityCard}`}>
        <form onSubmit={handleUpdatePassword} className={styles.securityForm}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Current Password</label>
            <div className={styles.inputWithIcon}>
              <input
                type={showCurrent ? 'text' : 'password'}
                className={styles.inputField}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.toggleVisibilityBtn}
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>New Password</label>
            <div className={styles.inputWithIcon}>
              <input
                type={showNew ? 'text' : 'password'}
                className={styles.inputField}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.toggleVisibilityBtn}
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Confirm New Password</label>
            <div className={styles.inputWithIcon}>
              <input
                type={showConfirm ? 'text' : 'password'}
                className={styles.inputField}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.toggleVisibilityBtn}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className={styles.actionRow}>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary} ${styles.btnMd}`}
              disabled={isLoading}
            >
              {isLoading && <span className={styles.spinner}></span>}
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

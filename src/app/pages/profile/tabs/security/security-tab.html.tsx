import React from 'react';
import { SecurityTabTemplateProps } from './interfaces/security-tab-template-props.interface';
import { PasswordSection } from './components/password-section.component';
import { TwoFactorSection } from './components/two-factor-section.component';
import { PasskeysSection } from './components/passkeys-section.component';
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

  // 2FA props
  is2faEnabled,
  twoFactorStep,
  setTwoFactorStep,
  qrCodeUrl,
  totpSecret,
  verificationCode,
  setVerificationCode,
  handleSetup2FA,
  handleEnable2FA,
  handleDisable2FA,
  recoveryCodes,
  setRecoveryCodes,
  showToast,

  // Passkey props
  handleRegisterPasskey,
  passkeys,
  handleDeletePasskey,
  deletingPasskeyId,
  setDeletingPasskeyId,
}) => {
  return (
    <div className={styles.tabPane}>
      <div className={styles.settingsContainer}>
        
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Password & Security</h1>
          <p className={styles.pageSubtitle}>Manage your credentials and security preferences.</p>
        </div>

        {/* Password Section */}
        <PasswordSection
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          isLoading={isLoading}
          showCurrent={showCurrent}
          setShowCurrent={setShowCurrent}
          showNew={showNew}
          setShowNew={setShowNew}
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
          handleUpdatePassword={handleUpdatePassword}
        />

        {/* Two-factor Authentication Section */}
        <TwoFactorSection
          is2faEnabled={is2faEnabled}
          twoFactorStep={twoFactorStep}
          setTwoFactorStep={setTwoFactorStep}
          qrCodeUrl={qrCodeUrl}
          totpSecret={totpSecret}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          handleSetup2FA={handleSetup2FA}
          handleEnable2FA={handleEnable2FA}
          handleDisable2FA={handleDisable2FA}
          recoveryCodes={recoveryCodes}
          setRecoveryCodes={setRecoveryCodes}
          showToast={showToast}
        />

        {/* Passkeys Section */}
        <PasskeysSection
          handleRegisterPasskey={handleRegisterPasskey}
          passkeys={passkeys}
          handleDeletePasskey={handleDeletePasskey}
          deletingPasskeyId={deletingPasskeyId}
          setDeletingPasskeyId={setDeletingPasskeyId}
        />

      </div>
    </div>
  );
};

export default SecurityTabTemplate;

import React from 'react';
import { EnterPanel } from 'shared/ui';
import { SecurityTabTemplateProps } from './interfaces/security-tab-template-props.interface';
import { PasswordSection } from './components/password-section.component';
import { TwoFactorSection } from './components/two-factor-section.component';
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
  accountUsername,
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
    <EnterPanel animation="fade" className={styles['tab-pane']}>
      <div className={styles['settings-container']}>
        
        <div className={styles['page-header']}>
          <h1 className={styles['page-title']}>Password & Security</h1>
          <p className={styles['page-subtitle']}>Manage your credentials and security preferences.</p>
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

        {/* Two-step verification methods (Authenticator + Passkeys) */}
        <TwoFactorSection
          is2faEnabled={is2faEnabled}
          twoFactorStep={twoFactorStep}
          setTwoFactorStep={setTwoFactorStep}
          qrCodeUrl={qrCodeUrl}
          totpSecret={totpSecret}
          accountUsername={accountUsername}
          handleSetup2FA={handleSetup2FA}
          handleEnable2FA={handleEnable2FA}
          handleDisable2FA={handleDisable2FA}
          recoveryCodes={recoveryCodes}
          setRecoveryCodes={setRecoveryCodes}
          showToast={showToast}
          handleRegisterPasskey={handleRegisterPasskey}
          passkeys={passkeys}
          handleDeletePasskey={handleDeletePasskey}
          deletingPasskeyId={deletingPasskeyId}
          setDeletingPasskeyId={setDeletingPasskeyId}
        />

      </div>
    </EnterPanel>
  );
};

export default SecurityTabTemplate;

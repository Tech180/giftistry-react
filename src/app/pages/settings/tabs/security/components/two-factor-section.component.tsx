import React, { useEffect, useState } from 'react';
import {
  TwoFactorFlowStep,
  TwoFactorSectionProps,
} from '../interfaces/two-factor-section-props.interface';
import { PasskeysSectionProps } from '../interfaces/passkeys-section-props.interface';
import { TwoFactorSectionTemplate } from './two-factor-section.html';

type TwoFactorSectionContainerProps = TwoFactorSectionProps &
  PasskeysSectionProps & {
    setRecoveryCodes: (codes: string[]) => void;
  };

export const TwoFactorSection: React.FC<TwoFactorSectionContainerProps> = ({
  recoveryCodes,
  totpSecret,
  showToast,
  setTwoFactorStep,
  handleSetup2FA,
  is2faEnabled,
  twoFactorStep,
  ...props
}) => {
  const [flowStep, setFlowStep] = useState<TwoFactorFlowStep | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedCodesConfirmed, setSavedCodesConfirmed] = useState(false);

  useEffect(() => {
    if (recoveryCodes.length > 0 && twoFactorStep === 'setup') {
      setSavedCodesConfirmed(false);
      setFlowStep('setup-recovery');
      setIsExpanded(true);
    }
  }, [recoveryCodes, twoFactorStep]);

  useEffect(() => {
    if (!isExpanded || (flowStep !== 'setup-qr' && flowStep !== 'disable')) {
      return;
    }

    const inputId = flowStep === 'setup-qr' ? 'otp-setup' : 'otp-disable';
    const timer = window.setTimeout(() => {
      document.getElementById(inputId)?.focus();
    }, 320);

    return () => window.clearTimeout(timer);
  }, [flowStep, isExpanded]);

  useEffect(() => {
    if (!is2faEnabled && flowStep === 'disable') {
      setIsExpanded(false);
      setFlowStep(null);
    }
  }, [is2faEnabled, flowStep]);

  const closeExpandable = () => {
    setIsExpanded(false);
    window.setTimeout(() => setFlowStep(null), 300);
    setTwoFactorStep('none');
  };

  const onToggleSetup = async () => {
    if (isExpanded && flowStep === 'setup-qr') {
      closeExpandable();
      return;
    }

    const ok = await handleSetup2FA();
    if (ok) {
      setFlowStep('setup-qr');
      setIsExpanded(true);
    }
  };

  const onToggleViewRecovery = () => {
    if (isExpanded && flowStep === 'view-recovery') {
      closeExpandable();
      return;
    }

    setFlowStep('view-recovery');
    setIsExpanded(true);
  };

  const onToggleDisable = () => {
    if (isExpanded && flowStep === 'disable') {
      closeExpandable();
      return;
    }

    setTwoFactorStep('disable');
    setFlowStep('disable');
    setIsExpanded(true);
  };

  const onCompleteSetup = () => {
    setTwoFactorStep('none');
    setSavedCodesConfirmed(false);
    setIsExpanded(false);
    setFlowStep(null);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(totpSecret.replace(/\s/g, ''));
    showToast?.('Copied to clipboard', 'success');
  };

  const handleCopyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    showToast?.('Recovery codes copied', 'success');
  };

  const handleDownloadRecoveryCodes = () => {
    const element = document.createElement('a');
    const file = new Blob([recoveryCodes.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'giftistry-recovery-codes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast?.('Download started', 'success');
  };

  return (
    <TwoFactorSectionTemplate
      {...props}
      is2faEnabled={is2faEnabled}
      twoFactorStep={twoFactorStep}
      recoveryCodes={recoveryCodes}
      totpSecret={totpSecret}
      showToast={showToast}
      setTwoFactorStep={setTwoFactorStep}
      handleSetup2FA={handleSetup2FA}
      flowStep={flowStep}
      isExpanded={isExpanded}
      savedCodesConfirmed={savedCodesConfirmed}
      setSavedCodesConfirmed={setSavedCodesConfirmed}
      onToggleSetup={onToggleSetup}
      onToggleViewRecovery={onToggleViewRecovery}
      onToggleDisable={onToggleDisable}
      onCloseExpandable={closeExpandable}
      onCompleteSetup={onCompleteSetup}
      handleCopySecret={handleCopySecret}
      handleCopyRecoveryCodes={handleCopyRecoveryCodes}
      handleDownloadRecoveryCodes={handleDownloadRecoveryCodes}
    />
  );
};

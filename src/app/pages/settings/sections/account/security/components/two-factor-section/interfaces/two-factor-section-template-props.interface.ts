import type { PasskeysSectionProps } from '../../passkeys-section/interfaces/passkeys-section-props.interface';
import type { TwoFactorFlowStep } from './two-factor-flow-step.type';
import type { TwoFactorSectionProps } from './two-factor-section-props.interface';

export interface TwoFactorSectionTemplateProps
  extends TwoFactorSectionProps,
    PasskeysSectionProps {
  flowStep: TwoFactorFlowStep | null;
  isExpanded: boolean;
  savedCodesConfirmed: boolean;
  setSavedCodesConfirmed: (confirmed: boolean) => void;
  onToggleSetup: () => void;
  onToggleViewRecovery: () => void;
  onToggleDisable: () => void;
  onCloseExpandable: () => void;
  onCompleteSetup: () => void;
  handleCopySecret: () => void;
  handleCopyRecoveryCodes: () => void;
  handleDownloadRecoveryCodes: () => void;
}

import { PasswordSectionProps } from '../components/password-section/interfaces/password-section-props.interface';
import { TwoFactorSectionProps } from '../components/two-factor-section/interfaces/two-factor-section-props.interface';
import { PasskeysSectionProps } from '../components/passkeys-section/interfaces/passkeys-section-props.interface';

export interface SecurityTemplateProps
  extends PasswordSectionProps,
    TwoFactorSectionProps,
    PasskeysSectionProps {
  setRecoveryCodes: (codes: string[]) => void;
}

export default SecurityTemplateProps;

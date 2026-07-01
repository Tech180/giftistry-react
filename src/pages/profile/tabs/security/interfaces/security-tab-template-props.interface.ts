import { PasswordSectionProps } from './password-section-props.interface';
import { TwoFactorSectionProps } from './two-factor-section-props.interface';
import { PasskeysSectionProps } from './passkeys-section-props.interface';

export interface SecurityTabTemplateProps
  extends PasswordSectionProps,
    TwoFactorSectionProps,
    PasskeysSectionProps {}

export default SecurityTabTemplateProps;

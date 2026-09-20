import type { PasskeysSectionProps } from '../../passkeys-section/interfaces/passkeys-section-props.interface';
import type { TwoFactorSectionProps } from './two-factor-section-props.interface';

export interface TwoFactorSectionContainerProps
  extends TwoFactorSectionProps,
    PasskeysSectionProps {
  setRecoveryCodes: (codes: string[]) => void;
}

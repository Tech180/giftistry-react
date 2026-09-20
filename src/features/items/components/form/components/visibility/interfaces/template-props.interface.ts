import type { Props } from './props.interface';

export interface TemplateProps extends Props {
  isSubstitutionSurface: boolean;
  isClaimerCustomStrip: boolean;
  showClaimOnCreate: boolean;
}

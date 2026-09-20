import type { GiftistryUserPolicy } from 'features/admin';

export interface DefaultPolicyToggleDefinition {
  key: keyof GiftistryUserPolicy;
  title: string;
  description: string;
}

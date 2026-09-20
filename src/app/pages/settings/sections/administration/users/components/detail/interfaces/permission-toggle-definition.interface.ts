import type { GiftistryUserPolicy } from 'features/admin';

export interface PermissionToggleDefinition {
  key: keyof GiftistryUserPolicy;
  title: string;
  description: string;
}

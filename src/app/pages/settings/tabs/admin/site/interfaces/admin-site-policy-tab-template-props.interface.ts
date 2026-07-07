import type { GiftistryUserPolicy, SitePolicy } from 'features/admin';

export interface AdminSitePolicyTabTemplateProps {
  isLoading: boolean;
  policy: SitePolicy | null;
  domainsText: string;
  isSaving: boolean;
  onPolicyChange: (policy: SitePolicy) => void;
  onDomainsTextChange: (value: string) => void;
  onDefaultPolicyToggle: (key: keyof GiftistryUserPolicy, value: boolean | number) => void;
  onSave: () => void;
}

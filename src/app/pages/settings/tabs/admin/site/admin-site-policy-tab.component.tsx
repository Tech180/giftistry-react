import React, { useEffect, useState } from 'react';
import { adminApi, DEFAULT_USER_POLICY } from 'features/admin';
import type { SitePolicy } from 'features/admin';
import { AdminTabProps } from '../interfaces/admin-tab-props.interface';
import { AdminSitePolicyTabTemplate } from './admin-site-policy-tab.html';

export const AdminSitePolicyTab: React.FC<AdminTabProps> = ({ showToast }) => {
  const [policy, setPolicy] = useState<SitePolicy | null>(null);
  const [domainsText, setDomainsText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    adminApi
      .getSitePolicy()
      .then((res) => {
        setPolicy(res.Policy);
        setDomainsText((res.Policy.AllowedEmailDomains ?? []).join(', '));
      })
      .catch((err) => showToast(err.message || 'Failed to load site policy', 'error'))
      .finally(() => setIsLoading(false));
  }, [showToast]);

  const save = async () => {
    if (!policy) return;
    setIsSaving(true);
    try {
      const allowedEmailDomains = domainsText
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
      const res = await adminApi.updateSitePolicy({ ...policy, AllowedEmailDomains: allowedEmailDomains });
      setPolicy(res.Policy);
      showToast('Site policy saved', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to save site policy', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDefaultPolicy = (key: keyof typeof DEFAULT_USER_POLICY, value: boolean | number) => {
    setPolicy((prev) =>
      prev
        ? {
            ...prev,
            DefaultUserPolicy: { ...prev.DefaultUserPolicy, [key]: value },
          }
        : prev
    );
  };

  return (
    <AdminSitePolicyTabTemplate
      isLoading={isLoading}
      policy={policy}
      domainsText={domainsText}
      isSaving={isSaving}
      onPolicyChange={setPolicy}
      onDomainsTextChange={setDomainsText}
      onDefaultPolicyToggle={toggleDefaultPolicy}
      onSave={save}
    />
  );
};

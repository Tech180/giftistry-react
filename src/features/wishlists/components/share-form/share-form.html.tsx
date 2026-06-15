import React from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { Input, Button } from 'shared/ui';
import { ShareFormTemplateProps } from '../../interfaces/share-form-template-props.interface';
import styles from './share-form.module.css';

export const ShareFormTemplate: React.FC<ShareFormTemplateProps> = ({
  email,
  setEmail,
  role,
  setRole,
  isLoading,
  errorMsg,
  successMsg,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {errorMsg && (
        <div className={`${styles.alert} ${styles.alertError} animate-slide-up`}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className={`${styles.alert} ${styles.alertSuccess} animate-slide-up`}>
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <Input
        label="Collaborator Email *"
        type="email"
        placeholder="friend@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail size={16} />}
        required
      />

      <div className={styles.selectGroup}>
        <label className={styles.label}>Access Level *</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'viewer' | 'collaborator')}
          className={styles.select}
        >
          <option value="viewer">Viewer (Can view and claim items)</option>
          <option value="collaborator">Collaborator (Can add/edit items & comments)</option>
        </select>
      </div>

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className={styles.submitBtn}
      >
        Share Access
      </Button>
    </form>
  );
};

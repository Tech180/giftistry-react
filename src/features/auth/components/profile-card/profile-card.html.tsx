import React from 'react';
import { Smile, User as UserIcon, Check, AlertCircle } from 'lucide-react';
import { Input, Button, Card } from 'shared/ui';
import { ProfileCardTemplateProps } from '../../interfaces/profile-card-template-props.interface';
import styles from './profile-card.module.css';

export const ProfileCardTemplate: React.FC<ProfileCardTemplateProps> = ({
  user,
  username,
  setUsername,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  isLoading,
  errorMsg,
  successMsg,
  handleSubmit,
}) => {
  return (
    <Card className={`${styles.profileCard} animate-scale-in`} padding="lg" glass={true}>
      <div className={styles.header}>
        <h2 className={styles.title}>Account Settings</h2>
        <p className={styles.subtitle}>Update your registry profile information</p>
      </div>

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

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.nameRow}>
          <Input
            label="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            leftIcon={<Smile size={16} />}
            required
          />
          <Input
            label="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            leftIcon={<Smile size={16} />}
            required
          />
        </div>

        <Input
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          leftIcon={<UserIcon size={16} />}
          required
        />

        <Input
          label="Email (Cannot be changed)"
          type="email"
          value={user.Email}
          disabled
          style={{ opacity: 0.6 }}
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className={styles.submitBtn}
        >
          Save Changes
        </Button>
      </form>
    </Card>
  );
};

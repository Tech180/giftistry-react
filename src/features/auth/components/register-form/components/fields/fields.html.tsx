import React from 'react';
import { Mail, Lock, User as UserIcon, Smile } from 'lucide-react';
import { Input } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './fields.module.css';

export const FieldsTemplate: React.FC<TemplateProps> = ({
  username,
  setUsername,
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) => {
  return (
    <div className={styles.fields}>
      <div className={styles['name-row']}>
        <Input
          label="First Name *"
          type="text"
          placeholder="John"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          leftIcon={<Smile size={16} />}
          required
        />
        <Input
          label="Last Name *"
          type="text"
          placeholder="Doe"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          leftIcon={<Smile size={16} />}
          required
        />
      </div>

      <Input
        label="Username *"
        type="text"
        placeholder="johndoe"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        leftIcon={<UserIcon size={16} />}
        required
      />

      <Input
        label="Email Address (optional)"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail size={16} />}
      />

      <Input
        label="Password *"
        type="password"
        placeholder="Min 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon={<Lock size={16} />}
        required
      />

      <Input
        label="Confirm Password *"
        type="password"
        placeholder="Re-enter password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        leftIcon={<Lock size={16} />}
        required
      />
    </div>
  );
};

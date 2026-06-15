import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, AlertCircle, Smile } from 'lucide-react';
import { Input, Button, Card } from 'shared/ui';
import { RegisterFormTemplateProps } from '../../interfaces/register-form-template-props.interface';
import styles from './register-form.module.css';

export const RegisterFormTemplate: React.FC<RegisterFormTemplateProps> = ({
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
  isLoading,
  localError,
  handleSubmit,
}) => {
  return (
    <Card className={`${styles.registerCard} animate-scale-in`} padding="lg" glass={true}>
      <div className={styles.header}>
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Get started with your custom gift registry</p>
      </div>

      {localError && (
        <div className={`${styles.alert} animate-slide-up`}>
          <AlertCircle size={16} />
          <span>{localError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.nameRow}>
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
          label="Email Address *"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={16} />}
          required
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

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className={styles.submitBtn}
        >
          Create Account
        </Button>
      </form>

      <div className={styles.footer}>
        <span>Already have an account?</span>{' '}
        <Link to="/login" className={styles.link}>
          Sign in
        </Link>
      </div>
    </Card>
  );
};

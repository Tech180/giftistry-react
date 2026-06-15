import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Input, Button, Card } from 'shared/ui';
import { LoginFormTemplateProps } from '../../interfaces/login-form-template-props.interface';
import styles from './login-form.module.css';

export const LoginFormTemplate: React.FC<LoginFormTemplateProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  localError,
  handleSubmit,
}) => {
  return (
    <Card className={`${styles.loginCard} animate-scale-in`} padding="lg" glass={true}>
      <div className={styles.header}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to your Giftistry account</p>
      </div>

      {localError && (
        <div className={`${styles.alert} animate-slide-up`}>
          <AlertCircle size={16} />
          <span>{localError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={16} />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock size={16} />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className={styles.submitBtn}
        >
          Sign In
        </Button>
      </form>

      <div className={styles.footer}>
        <span>Don't have an account?</span>{' '}
        <Link to="/register" className={styles.link}>
          Sign up
        </Link>
      </div>
    </Card>
  );
};

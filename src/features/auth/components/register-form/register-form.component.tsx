import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'app/providers/auth-context';
import { RegisterFormTemplate } from './register-form.html';

export const RegisterForm: React.FC = () => {
  const { signup, registrationMode, requireStrongPasswords } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (registrationMode === 'disabled' || registrationMode === 'invite_only') {
      setLocalError(
        registrationMode === 'disabled'
          ? 'Registration is currently disabled on this server.'
          : 'Registration is invite-only. Contact an administrator for access.'
      );
      return;
    }
    if (!username || !password || !firstName || !lastName) {
      setLocalError('Please fill out all required fields.');
      return;
    }

    if (email.trim() && !/\S+@\S+\.\S+/.test(email.trim())) {
      setLocalError('Please enter a valid email address, or leave it blank.');
      return;
    }

    if (requireStrongPasswords) {
      if (password.length < 8) {
        setLocalError('Password must be at least 8 characters long.');
        return;
      }
      if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        setLocalError('Password must include at least one letter and one number.');
        return;
      }
    } else if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setLocalError(null);
    setIsLoading(true);

    try {
      await signup(username, email.trim() || null, password, firstName, lastName);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Registration failed. Username or email may already be taken.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterFormTemplate
      registrationClosed={registrationMode === 'disabled' || registrationMode === 'invite_only'}
      registrationClosedMessage={
        registrationMode === 'disabled'
          ? 'Registration is currently disabled on this server.'
          : registrationMode === 'invite_only'
            ? 'Registration is invite-only. Contact an administrator for access.'
            : undefined
      }
      username={username}
      setUsername={setUsername}
      email={email}
      setEmail={setEmail}
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      isLoading={isLoading}
      localError={localError}
      handleSubmit={handleSubmit}
    />
  );
};

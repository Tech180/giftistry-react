import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'app/providers/AuthContext';
import { RegisterFormTemplate } from './register-form.html';

export const RegisterForm: React.FC = () => {
  const { signup } = useAuth();
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
    if (!username || !email || !password || !firstName || !lastName) {
      setLocalError('Please fill out all required fields.');
      return;
    }

    if (password.length < 6) {
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
      await signup(username, email, password, firstName, lastName);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Registration failed. Username or email may already be taken.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterFormTemplate
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

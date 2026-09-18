import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from 'app/providers/auth-context';
import { authApi } from '../../api/auth.api';
import { validateUsername } from 'shared/utils/validate-username.util';
import { RegisterFormTemplate } from './register-form.html';

const INVITE_INVALID_OR_EXPIRED =
  'This invitation link is invalid or has expired.';

export const RegisterForm: React.FC = () => {
  const {
    signup,
    registrationMode,
    requireStrongPasswords,
    oauthEnabled,
    oauthButtonText,
  } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get('invite')?.trim() || null;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [inviteValidating, setInviteValidating] = useState(false);
  const [inviteValid, setInviteValid] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (registrationMode === 'open') {
        setInviteValid(true);
        setInviteValidating(false);
        return;
      }
      if (registrationMode === 'disabled') {
        setInviteValid(false);
        setInviteValidating(false);
        return;
      }
      if (!inviteToken) {
        setInviteValid(false);
        setInviteValidating(false);
        return;
      }

      setInviteValidating(true);
      try {
        const res = await authApi.validateRegistrationInvite(inviteToken);
        if (cancelled) return;
        if (!res.Valid) {
          navigate('/login', {
            replace: true,
            state: { error: INVITE_INVALID_OR_EXPIRED },
          });
          return;
        }
        setInviteValid(true);
      } catch {
        if (cancelled) return;
        navigate('/login', {
          replace: true,
          state: { error: INVITE_INVALID_OR_EXPIRED },
        });
      } finally {
        if (!cancelled) {
          setInviteValidating(false);
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [registrationMode, inviteToken, navigate]);

  const registrationClosed =
    registrationMode === 'disabled' ||
    (registrationMode === 'invite_only' && !inviteValid);

  const registrationClosedMessage =
    registrationMode === 'disabled'
      ? 'Registration is currently disabled on this server.'
      : registrationMode === 'invite_only' && !inviteToken
        ? 'Registration is invite-only. Use a valid invite link from an administrator.'
        : undefined;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (registrationClosed) {
      setLocalError(
        registrationClosedMessage ||
          'Registration is invite-only. Contact an administrator for access.'
      );
      return;
    }
    if (!username || !password || !firstName || !lastName) {
      setLocalError('Please fill out all required fields.');
      return;
    }

    const usernameCheck = validateUsername(username);
    if (!usernameCheck.ok) {
      setLocalError(usernameCheck.message);
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
      await signup(
        usernameCheck.value,
        email.trim() || null,
        password,
        firstName,
        lastName,
        registrationMode === 'invite_only' ? inviteToken : null
      );
      navigate('/dashboard');
    } catch (err) {
      setLocalError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Username or email may already be taken.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterFormTemplate
      registrationClosed={registrationClosed}
      registrationClosedMessage={registrationClosedMessage}
      inviteValidating={inviteValidating}
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
      oauthEnabled={oauthEnabled && !registrationClosed}
      oauthButtonText={oauthButtonText}
      onOauthSignup={() => authApi.beginOauthLogin(inviteToken)}
      handleSubmit={handleSubmit}
    />
  );
};

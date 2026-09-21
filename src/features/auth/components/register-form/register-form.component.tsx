import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../providers';
import { authApi } from '../../api/auth.api';
import { INVITE_INVALID_OR_EXPIRED } from './constants/invite-invalid-or-expired.constant';
import { getClosedMessage } from './utils/get-closed-message.util';
import { validateSubmission } from './utils/validate-submission.util';
import { Fields } from './components/fields/fields.component';
import { Actions } from './components/actions/actions.component';
import { RegisterFormTemplate } from './register-form.html';

export const RegisterForm: React.FC = () => {
  const {
    signup,
    registrationMode,
    requireStrongPasswords,
    oauthEnabled,
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

        if (cancelled) {
          return;
        }

        if (!res.Valid) {
          navigate('/login', {
            replace: true,
            state: { error: INVITE_INVALID_OR_EXPIRED },
          });
          return;
        }

        setInviteValid(true);
      } catch {
        if (cancelled) {
          return;
        }

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
    registrationMode === 'disabled' || (registrationMode === 'invite_only' && !inviteValid);

  const registrationClosedMessage = getClosedMessage(registrationMode, inviteToken);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (registrationClosed) {
      setLocalError(
        registrationClosedMessage ||
          'Registration is invite-only. Contact an administrator for access.',
      );
      return;
    }

    const validation = validateSubmission({
      username,
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      requireStrongPasswords,
    });

    if (!validation.ok) {
      setLocalError(validation.message);
      return;
    }

    setLocalError(null);
    setIsLoading(true);

    try {
      await signup(
        validation.username,
        email.trim() || null,
        password,
        firstName,
        lastName,
        registrationMode === 'invite_only' ? inviteToken : null,
      );
      navigate('/dashboard');
    } catch (err) {
      setLocalError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Username or email may already be taken.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterFormTemplate
      inviteValidating = {
        inviteValidating
      }
      registrationClosed = {
        registrationClosed
      }
      registrationClosedMessage = {
        registrationClosedMessage
      }
      localError = {
        localError
      }
      handleSubmit = {
        handleSubmit
      }
      fields = {
        <Fields
          username = {
            username
          }
          setUsername = {
            setUsername
          }
          email = {
            email
          }
          setEmail = {
            setEmail
          }
          firstName = {
            firstName
          }
          setFirstName = {
            setFirstName
          }
          lastName = {
            lastName
          }
          setLastName = {
            setLastName
          }
          password = {
            password
          }
          setPassword = {
            setPassword
          }
          confirmPassword = {
            confirmPassword
          }
          setConfirmPassword = {
            setConfirmPassword
          }
        />
      }
      actions = {
        <Actions
          isLoading = {
            isLoading
          }
          disabled = {
            registrationClosed || inviteValidating
          }
          oauthEnabled = {
            oauthEnabled && !registrationClosed
          }
          onOauthSignup = {
            () => authApi.beginOauthLogin(inviteToken)
          }
        />
      }
    />
  );
};

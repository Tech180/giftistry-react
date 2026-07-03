import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from 'features/auth';
import { VerifyEmailTemplate } from './verify-email.html';

export const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const calledRef = React.useRef(false);

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (!token) {
      setStatus('error');
      setErrorMessage('Missing verification token.');
      return;
    }

    if (calledRef.current) {
      return;
    }
    calledRef.current = true;

    authApi.verifyEmail(token)
      .then(() => {
        setStatus('success');
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Invalid or expired verification token.');
      });
  }, [location]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <VerifyEmailTemplate
      status={status}
      errorMessage={errorMessage}
      handleGoToDashboard={handleGoToDashboard}
      handleGoHome={handleGoHome}
    />
  );
};

export default VerifyEmail;

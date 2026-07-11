import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from 'app/providers/auth-context';
import { useToast } from 'app/providers/toast-context';
import { authApi } from '../../api/auth.api';
import { VerificationBannerTemplate } from './verification-banner.html';

export const VerificationBanner: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (!user || user.EmailVerified) {
    return null;
  }

  const onResend = async () => {
    if (cooldown > 0) return;

    setIsLoading(true);
    try {
      await authApi.resendVerification();
      showToast("Verification email resent!\nPlease check your inbox.", 'success');
      
      // Start 60-second rate-limit cooldown
      setCooldown(60);
      timerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to resend verification email.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VerificationBannerTemplate
      onResend={onResend}
      isLoading={isLoading || cooldown > 0}
      cooldown={cooldown}
    />
  );
};

export default VerificationBanner;

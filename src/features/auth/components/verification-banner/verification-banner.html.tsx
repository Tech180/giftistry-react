import React from 'react';
import { VerificationBannerTemplateProps } from './interfaces/verification-banner-template-props.interface';
import styles from './verification-banner.module.css';

export const VerificationBannerTemplate: React.FC<VerificationBannerTemplateProps> = ({
  onResend,
  isLoading,
  cooldown,
}) => {
  return (
    <div className={styles.banner}>
      <div className={styles.textContainer}>
        <span>⚠️ Please verify your email address to unlock wishlist sharing and list creation. Check your inbox for a verification link.</span>
      </div>
      <button
        onClick={onResend}
        disabled={isLoading}
        className={styles.resendBtn}
      >
        {cooldown > 0 ? `Resend Email (${cooldown}s)` : 'Resend Email'}
      </button>
    </div>
  );
};
export default VerificationBannerTemplate;

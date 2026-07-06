import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button, Card } from 'shared/ui';
import { VerifyEmailTemplateProps } from './interfaces/verify-email-template-props.interface';
import styles from './verify-email.module.css';

export const VerifyEmailTemplate: React.FC<VerifyEmailTemplateProps> = ({
  status,
  errorMessage,
  handleGoToDashboard,
  handleGoHome,
}) => {
  return (
    <div className={styles.container}>
      <Card className={styles.card} glass={true}>
        {status === 'loading' && (
          <div className={styles['flex-center']}>
            <Loader2 className={styles.spinner} />
            <h2 className={styles.title}>Verifying Your Email</h2>
            <p className={styles.subtitle}>
              Please wait while we confirm your email verification details.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className={styles['flex-center']}>
            <CheckCircle className={styles['icon-success']} />
            <h2 className={styles['title-success']}>Email Verified!</h2>
            <p className={styles.subtitle}>
              Your email address has been successfully verified. You now have full access to create and share registry lists.
            </p>
            <Button
              onClick={handleGoToDashboard}
              variant="primary"
              className={styles['action-btn']}
            >
              Go to Dashboard
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className={styles['flex-center']}>
            <XCircle className={styles['icon-error']} />
            <h2 className={styles['title-error']}>Verification Failed</h2>
            <p className={styles.subtitle}>
              {errorMessage || 'The verification link is invalid, expired, or has already been used.'}
            </p>
            <div className={styles['error-actions']}>
              <Button
                onClick={handleGoHome}
                variant="secondary"
                className={styles['secondary-btn']}
              >
                Go to Home
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
export default VerifyEmailTemplate;

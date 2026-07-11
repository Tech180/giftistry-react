import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SetupTemplate } from './setup.html';
import { useAuth } from 'app/providers/auth-context';
import { useToast } from 'app/providers/toast-context';
import { apiClient } from 'core/api/client';

export const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { checkSystemStatus } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [dbType, setDbType] = useState<'local' | 'remote'>('local');
  const [dbUrl, setDbUrl] = useState('');

  const [smtpType, setSmtpType] = useState<'local' | 'remote'>('local');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpFrom, setSmtpFrom] = useState('noreply@giftistry.local');

  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    // Clear errors when user types
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      delete copy.dbUrl;
      delete copy.smtp;
      delete copy.setup;
      return copy;
    });

    switch (field) {
      case 'dbType':
        setDbType(value);
        break;
      case 'dbUrl':
        setDbUrl(value);
        break;
      case 'smtpType':
        setSmtpType(value);
        break;
      case 'smtpHost':
        setSmtpHost(value);
        break;
      case 'smtpPort':
        setSmtpPort(value);
        break;
      case 'smtpUser':
        setSmtpUser(value);
        break;
      case 'smtpPass':
        setSmtpPass(value);
        break;
      case 'smtpSecure':
        setSmtpSecure(value);
        break;
      case 'smtpFrom':
        setSmtpFrom(value);
        break;
      case 'adminUsername':
        setAdminUsername(value);
        break;
      case 'adminEmail':
        setAdminEmail(value);
        break;
      case 'adminPassword':
        setAdminPassword(value);
        break;
      case 'adminConfirmPassword':
        setAdminConfirmPassword(value);
        break;
      case 'adminFirstName':
        setAdminFirstName(value);
        break;
      case 'adminLastName':
        setAdminLastName(value);
        break;
      default:
        break;
    }
  };

  const validateStep = (): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (dbType === 'remote' && !dbUrl.trim()) {
        stepErrors.dbUrl = 'Database Connection URL is required for remote database';
      }
    }

    if (step === 2) {
      if (smtpType === 'remote') {
        if (!smtpHost.trim()) {
          stepErrors.smtp = 'SMTP Host is required';
        } else if (!smtpPort) {
          stepErrors.smtp = 'SMTP Port is required';
        }
      }
    }

    if (step === 3) {
      if (!adminUsername.trim()) {
        stepErrors.adminUsername = 'Username is required';
      }
      if (!adminFirstName.trim()) {
        stepErrors.adminFirstName = 'First name is required';
      }
      if (!adminLastName.trim()) {
        stepErrors.adminLastName = 'Last name is required';
      }
      if (!adminEmail.trim()) {
        stepErrors.adminEmail = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(adminEmail)) {
        stepErrors.adminEmail = 'Invalid email address';
      }
      if (!adminPassword) {
        stepErrors.adminPassword = 'Password is required';
      } else if (adminPassword.length < 6) {
        stepErrors.adminPassword = 'Password must be at least 6 characters';
      }
      if (adminPassword !== adminConfirmPassword) {
        stepErrors.adminConfirmPassword = 'Passwords do not match';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      // Step 3 -> submit setup request!
      setIsSubmitting(true);
      setStep(4); // Show installation progress screen

      try {
        await apiClient.post('/api/system/setup', {
          Giftistry: {
            Setup: {
              DbType: dbType,
              DbUrl: dbType === 'remote' ? dbUrl : undefined,
              SmtpType: smtpType,
              SmtpHost: smtpType === 'remote' ? smtpHost : undefined,
              SmtpPort: smtpType === 'remote' ? smtpPort : undefined,
              SmtpUser: smtpType === 'remote' ? smtpUser : undefined,
              SmtpPass: smtpType === 'remote' ? smtpPass : undefined,
              SmtpSecure: smtpType === 'remote' ? smtpSecure : undefined,
              SmtpFrom: smtpType === 'remote' ? smtpFrom : undefined,
              Admin: {
                Username: adminUsername,
                Email: adminEmail,
                Password: adminPassword,
                FirstName: adminFirstName,
                LastName: adminLastName,
              },
            }
          }
        });

        showToast('Setup completed successfully! Please login with your administrator account.', 'success');
        // Let AuthContext know setup is completed
        await checkSystemStatus();
        navigate('/login');
      } catch (err: any) {
        // Drop back to Step 3 and show error
        setStep(3);
        const errMsg = err instanceof Error ? err.message : 'Setup failed. Please check connection credentials.';
        setErrors({
          setup: errMsg,
        });
        showToast(errMsg, 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <SetupTemplate
      step={step}
      dbType={dbType}
      dbUrl={dbUrl}
      smtpType={smtpType}
      smtpHost={smtpHost}
      smtpPort={smtpPort}
      smtpUser={smtpUser}
      smtpPass={smtpPass}
      smtpSecure={smtpSecure}
      smtpFrom={smtpFrom}
      adminUsername={adminUsername}
      adminEmail={adminEmail}
      adminPassword={adminPassword}
      adminConfirmPassword={adminConfirmPassword}
      adminFirstName={adminFirstName}
      adminLastName={adminLastName}
      errors={errors}
      isSubmitting={isSubmitting}
      onFieldChange={handleFieldChange}
      onNext={handleNext}
      onPrev={handlePrev}
    />
  );
};

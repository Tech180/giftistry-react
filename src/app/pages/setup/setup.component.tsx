import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SetupTemplate } from './setup.html';
import type { SetupInstallTask } from './interfaces/setup-props.interface';
import { useAuth } from 'app/providers/auth-context';
import { useToast } from 'app/providers/toast-context';
import { apiClient, ApiError } from 'core/api/client';
import {
  formatApiErrorMessage,
  mapValidationErrorsToFields,
} from 'shared/utils/format-api-error-message.util';
import { validateUsername } from 'shared/utils/validate-username.util';

const INITIAL_INSTALL_TASKS: SetupInstallTask[] = [
  { id: 't-db', label: 'Connecting to database...', status: 'pending' },
  { id: 't-schema', label: 'Applying schema migrations...', status: 'pending' },
  { id: 't-admin', label: 'Registering administrative user...', status: 'pending' },
  { id: 't-config', label: 'Writing configuration files...', status: 'pending' },
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const Setup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setupToken = searchParams.get('setup_token') ?? undefined;
  const { checkSystemStatus } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [dbType, setDbType] = useState<'local' | 'remote'>('local');
  const [dbUrl, setDbUrl] = useState('');

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [installTasks, setInstallTasks] = useState<SetupInstallTask[]>(INITIAL_INSTALL_TASKS);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFieldChange = (field: string, value: unknown) => {
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      delete copy.dbUrl;
      delete copy.setup;
      return copy;
    });

    switch (field) {
      case 'dbType':
        setDbType(value as 'local' | 'remote');
        break;
      case 'dbUrl':
        setDbUrl(String(value));
        break;
      case 'adminUsername':
        setAdminUsername(String(value));
        break;
      case 'adminPassword':
        setAdminPassword(String(value));
        break;
      case 'adminConfirmPassword':
        setAdminConfirmPassword(String(value));
        break;
      case 'adminFirstName':
        setAdminFirstName(String(value));
        break;
      case 'adminLastName':
        setAdminLastName(String(value));
        break;
      default:
        break;
    }
  };

  const validateStep = (): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (dbType === 'remote') {
        const url = dbUrl.trim();
        if (!url) {
          stepErrors.dbUrl = 'Connection URL is required.';
        } else if (!url.startsWith('postgres')) {
          stepErrors.dbUrl = 'Must be a valid postgres:// or postgresql:// URL';
        }
      }
    }

    if (step === 2) {
      if (!adminUsername.trim()) {
        stepErrors.adminUsername = 'Username is required';
      } else {
        const usernameCheck = validateUsername(adminUsername);
        if (!usernameCheck.ok) {
          stepErrors.adminUsername = usernameCheck.message;
        }
      }
      if (!adminFirstName.trim()) {
        stepErrors.adminFirstName = 'First name is required';
      }
      if (!adminLastName.trim()) {
        stepErrors.adminLastName = 'Last name is required';
      }
      if (!adminPassword) {
        stepErrors.adminPassword = 'Password is required';
      } else if (adminPassword.length < 8) {
        stepErrors.adminPassword = 'Password must be at least 8 characters';
      } else if (!/[A-Za-z]/.test(adminPassword) || !/[0-9]/.test(adminPassword)) {
        stepErrors.adminPassword = 'Password must include at least one letter and one number';
      }
      if (adminPassword !== adminConfirmPassword) {
        stepErrors.adminConfirmPassword = 'Passwords do not match';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const setTaskStatus = (index: number, status: SetupInstallTask['status']) => {
    setInstallTasks((prev) =>
      prev.map((task, i) => (i === index ? { ...task, status } : task))
    );
  };

  const runInstallProgress = async (apiPromise: Promise<unknown>) => {
    const tasks = INITIAL_INSTALL_TASKS;
    setInstallTasks(tasks.map((t) => ({ ...t, status: 'pending' })));

    let apiError: unknown = null;

    const apiDone = apiPromise.then(
      () => undefined,
      (err) => {
        apiError = err;
      }
    );

    for (let i = 0; i < tasks.length; i++) {
      setTaskStatus(i, 'active');

      if (i < tasks.length - 1) {
        await sleep(450 + Math.random() * 350);
        if (apiError) break;
        setTaskStatus(i, 'done');
      } else {
        await apiDone;
        if (!apiError) {
          setTaskStatus(i, 'done');
        }
      }
    }

    if (!apiError) {
      setInstallTasks((prev) => prev.map((t) => ({ ...t, status: 'done' as const })));
    }

    await apiDone;
    if (apiError) throw apiError;
  };

  const handleNext = async () => {
    if (step === 4) {
      navigate('/login');
      return;
    }

    if (!validateStep()) return;

    if (step < 2) {
      setStep((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);
    setStep(3);

    try {
      const usernameCheck = validateUsername(adminUsername);
      if (!usernameCheck.ok) {
        setStep(2);
        setErrors({ adminUsername: usernameCheck.message });
        showToast(usernameCheck.message, 'error');
        setIsSubmitting(false);
        return;
      }

      const apiPromise = apiClient.post('/api/system/setup', {
        Giftistry: {
          Setup: {
            DbType: dbType,
            DbUrl: dbType === 'remote' ? dbUrl : undefined,
            SetupToken: setupToken,
            Admin: {
              Username: usernameCheck.value,
              Password: adminPassword,
              FirstName: adminFirstName,
              LastName: adminLastName,
            },
          },
        },
      });

      await runInstallProgress(apiPromise);
      await checkSystemStatus();
      showToast(
        'Setup completed successfully! Please login with your administrator account.',
        'success'
      );
      setStep(4);
    } catch (err: unknown) {
      setStep(2);
      const details = err instanceof ApiError ? err.details : err;
      const fieldErrors = mapValidationErrorsToFields(details, {
        Password: 'adminPassword',
        Username: 'adminUsername',
        FirstName: 'adminFirstName',
        LastName: 'adminLastName',
        DbUrl: 'dbUrl',
      });
      const errMsg =
        Object.values(fieldErrors)[0] ||
        (err instanceof Error
          ? formatApiErrorMessage(err.message)
          : 'Setup failed. Please check your details and try again.');
      setErrors({
        ...fieldErrors,
        ...(Object.keys(fieldErrors).length === 0 ? { setup: errMsg } : {}),
      });
      showToast(errMsg, 'error');
      setInstallTasks(INITIAL_INSTALL_TASKS);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    if (step > 1 && step <= 2) {
      setStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    navigate('/login');
  };

  return (
    <SetupTemplate
      step={step}
      mobileStep={Math.min(step, 3)}
      showFooterBack={step === 2}
      showFooter={step !== 3}
      dbType={dbType}
      dbUrl={dbUrl}
      adminUsername={adminUsername}
      adminPassword={adminPassword}
      adminConfirmPassword={adminConfirmPassword}
      adminFirstName={adminFirstName}
      adminLastName={adminLastName}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      errors={errors}
      isSubmitting={isSubmitting}
      installTasks={installTasks}
      onFieldChange={handleFieldChange}
      onToggleShowPassword={() => setShowPassword((prev) => !prev)}
      onToggleShowConfirmPassword={() => setShowConfirmPassword((prev) => !prev)}
      onNext={handleNext}
      onPrev={handlePrev}
      onFinish={handleFinish}
    />
  );
};

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from 'features/auth';
import { useToast } from 'shared/providers/toast';
import { ApiError } from 'core/api/client';
import { systemApi } from 'features/system';
import {
  formatApiErrorMessage,
  mapValidationErrorsToFields,
} from 'core/api/utils/format-api-error-message.util';
import { validateUsername } from 'shared/utils/validate-username.util';
import { FIELD_ERROR_MAP } from '../constants/field-error-map.constant';
import { INITIAL_INSTALL_TASKS } from '../constants/install-tasks.constant';
import type { InstallTask } from '../interfaces/install-task.interface';
import type { PageTemplateProps } from '../interfaces/page-template-props.interface';
import { runInstallProgress } from '../utils/run-install-progress.util';
import { validateStep } from '../utils/validate-step.util';

export function usePage(): PageTemplateProps {
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
  const [installTasks, setInstallTasks] = useState<InstallTask[]>(INITIAL_INSTALL_TASKS);
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

  const handleNext = async () => {
    if (step === 4) {
      navigate('/login');
      return;
    }

    const stepErrors = validateStep(step, {
      dbType,
      dbUrl,
      adminUsername,
      adminPassword,
      adminConfirmPassword,
      adminFirstName,
      adminLastName,
    });
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      return;
    }

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

      const apiPromise = systemApi.runSetup({
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

      await runInstallProgress(apiPromise, setInstallTasks);
      await checkSystemStatus();
      showToast(
        'Setup completed successfully! Please login with your administrator account.',
        'success',
      );
      setStep(4);
    } catch (err: unknown) {
      setStep(2);
      const details = err instanceof ApiError ? err.details : err;
      const fieldErrors = mapValidationErrorsToFields(details, FIELD_ERROR_MAP);
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

  return {
    step,
    mobileStep: Math.min(step, 3),
    showFooterBack: step === 2,
    showFooter: step !== 3,
    dbType,
    dbUrl,
    adminUsername,
    adminPassword,
    adminConfirmPassword,
    adminFirstName,
    adminLastName,
    showPassword,
    showConfirmPassword,
    errors,
    isSubmitting,
    installTasks,
    onFieldChange: handleFieldChange,
    onToggleShowPassword: () => setShowPassword((prev) => !prev),
    onToggleShowConfirmPassword: () => setShowConfirmPassword((prev) => !prev),
    onNext: handleNext,
    onPrev: handlePrev,
    onFinish: handleFinish,
  };
}

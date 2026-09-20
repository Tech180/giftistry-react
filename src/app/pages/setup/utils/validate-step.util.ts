import { validateUsername } from 'shared/utils/validate-username.util';
import type { ValidateStepFields } from '../interfaces/validate-step-fields.interface';

export function validateStep(step: number, fields: ValidateStepFields): Record<string, string> {
  const stepErrors: Record<string, string> = {};

  if (step === 1) {
    if (fields.dbType === 'remote') {
      const url = fields.dbUrl.trim();
      if (!url) {
        stepErrors.dbUrl = 'Connection URL is required.';
      } else if (!url.startsWith('postgres')) {
        stepErrors.dbUrl = 'Must be a valid postgres:// or postgresql:// URL';
      }
    }
  }

  if (step === 2) {
    if (!fields.adminUsername.trim()) {
      stepErrors.adminUsername = 'Username is required';
    } else {
      const usernameCheck = validateUsername(fields.adminUsername);
      if (!usernameCheck.ok) {
        stepErrors.adminUsername = usernameCheck.message;
      }
    }

    if (!fields.adminFirstName.trim()) {
      stepErrors.adminFirstName = 'First name is required';
    }

    if (!fields.adminLastName.trim()) {
      stepErrors.adminLastName = 'Last name is required';
    }

    if (!fields.adminPassword) {
      stepErrors.adminPassword = 'Password is required';
    } else if (fields.adminPassword.length < 8) {
      stepErrors.adminPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Za-z]/.test(fields.adminPassword) || !/[0-9]/.test(fields.adminPassword)) {
      stepErrors.adminPassword = 'Password must include at least one letter and one number';
    }

    if (fields.adminPassword !== fields.adminConfirmPassword) {
      stepErrors.adminConfirmPassword = 'Passwords do not match';
    }
  }

  return stepErrors;
}

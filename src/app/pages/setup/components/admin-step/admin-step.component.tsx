import React from 'react';
import { AdminStepTemplate } from './admin-step.html';
import type { AdminStepProps } from './interfaces/props.interface';

export const AdminStep: React.FC<AdminStepProps> = ({
  adminUsername,
  adminPassword,
  adminConfirmPassword,
  adminFirstName,
  adminLastName,
  showPassword,
  showConfirmPassword,
  errors,
  onFieldChange,
  onToggleShowPassword,
  onToggleShowConfirmPassword,
}) => (
  <AdminStepTemplate
    adminUsername = {
      adminUsername
    }
    adminPassword = {
      adminPassword
    }
    adminConfirmPassword = {
      adminConfirmPassword
    }
    adminFirstName = {
      adminFirstName
    }
    adminLastName = {
      adminLastName
    }
    showPassword = {
      showPassword
    }
    showConfirmPassword = {
      showConfirmPassword
    }
    errors = {
      errors
    }
    onFieldChange = {
      onFieldChange
    }
    onToggleShowPassword = {
      onToggleShowPassword
    }
    onToggleShowConfirmPassword = {
      onToggleShowConfirmPassword
    }
  />
);

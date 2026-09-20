import React from 'react';
import { PageTemplate } from './page.html';
import { usePage } from './hooks/use-page';

export const Setup: React.FC = () => {
  const templateProps = usePage();

  return (
    <PageTemplate
      step = {
        templateProps.step
      }
      mobileStep = {
        templateProps.mobileStep
      }
      showFooterBack = {
        templateProps.showFooterBack
      }
      showFooter = {
        templateProps.showFooter
      }
      dbType = {
        templateProps.dbType
      }
      dbUrl = {
        templateProps.dbUrl
      }
      adminUsername = {
        templateProps.adminUsername
      }
      adminPassword = {
        templateProps.adminPassword
      }
      adminConfirmPassword = {
        templateProps.adminConfirmPassword
      }
      adminFirstName = {
        templateProps.adminFirstName
      }
      adminLastName = {
        templateProps.adminLastName
      }
      showPassword = {
        templateProps.showPassword
      }
      showConfirmPassword = {
        templateProps.showConfirmPassword
      }
      errors = {
        templateProps.errors
      }
      isSubmitting = {
        templateProps.isSubmitting
      }
      installTasks = {
        templateProps.installTasks
      }
      onFieldChange = {
        templateProps.onFieldChange
      }
      onToggleShowPassword = {
        templateProps.onToggleShowPassword
      }
      onToggleShowConfirmPassword = {
        templateProps.onToggleShowConfirmPassword
      }
      onNext = {
        templateProps.onNext
      }
      onPrev = {
        templateProps.onPrev
      }
      onFinish = {
        templateProps.onFinish
      }
    />
  );
};

import React from 'react';
import type { PasswordFormProps } from './interfaces/password-form-props.interface';
import { getSubmitLabel } from './utils/get-submit-label.util';
import { PasswordFormTemplate } from './password-form.html';

export const PasswordForm: React.FC<PasswordFormProps> = (props) => (
  <PasswordFormTemplate
    {...props}
    submitLabel={getSubmitLabel(props.isSubmitting, props.isAuthenticated)}
  />
);

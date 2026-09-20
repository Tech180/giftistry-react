import type { SubmitEvent } from 'react';

export interface PasswordFormProps {
  password: string;
  inviteError: string | null;
  isSubmitting: boolean;
  isAuthenticated: boolean;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

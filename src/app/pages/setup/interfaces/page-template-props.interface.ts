import type { InstallTask } from './install-task.interface';

export interface PageTemplateProps {
  step: number;
  mobileStep: number;
  showFooterBack: boolean;
  showFooter: boolean;
  dbType: 'local' | 'remote';
  dbUrl: string;
  adminUsername: string;
  adminPassword: string;
  adminConfirmPassword: string;
  adminFirstName: string;
  adminLastName: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  errors: Record<string, string>;
  isSubmitting: boolean;
  installTasks: InstallTask[];
  onFieldChange: (field: string, value: unknown) => void;
  onToggleShowPassword: () => void;
  onToggleShowConfirmPassword: () => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

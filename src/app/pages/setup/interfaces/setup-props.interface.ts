export type SetupInstallTaskStatus = 'pending' | 'active' | 'done';

export interface SetupInstallTask {
  id: string;
  label: string;
  status: SetupInstallTaskStatus;
}

export interface SetupTemplateProps {
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
  installTasks: SetupInstallTask[];
  onFieldChange: (field: string, value: unknown) => void;
  onToggleShowPassword: () => void;
  onToggleShowConfirmPassword: () => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

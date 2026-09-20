export interface AdminStepProps {
  adminUsername: string;
  adminPassword: string;
  adminConfirmPassword: string;
  adminFirstName: string;
  adminLastName: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: unknown) => void;
  onToggleShowPassword: () => void;
  onToggleShowConfirmPassword: () => void;
}

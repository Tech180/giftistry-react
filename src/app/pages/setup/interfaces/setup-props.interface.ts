export interface SetupTemplateProps {
  step: number;
  dbType: 'local' | 'remote';
  dbUrl: string;
  smtpType: 'local' | 'remote';
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
  smtpFrom: string;
  adminUsername: string;
  adminEmail: string;
  adminPassword: string;
  adminConfirmPassword: string;
  adminFirstName: string;
  adminLastName: string;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onFieldChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

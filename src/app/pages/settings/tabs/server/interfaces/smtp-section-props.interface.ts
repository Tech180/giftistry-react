export interface SmtpSectionProps {
  smtpType: 'local' | 'remote';
  setSmtpType: (value: 'local' | 'remote') => void;
  smtpHost: string;
  setSmtpHost: (value: string) => void;
  smtpPort: string;
  setSmtpPort: (value: string) => void;
  smtpUser: string;
  setSmtpUser: (value: string) => void;
  smtpPass: string;
  setSmtpPass: (value: string) => void;
  smtpSecure: boolean;
  setSmtpSecure: (value: boolean) => void;
  smtpFrom: string;
  setSmtpFrom: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
}

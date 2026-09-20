export interface UseSmtpSettingsResult {
  smtpType: 'local' | 'remote';
  setSmtpType: (type: 'local' | 'remote') => void;
  smtpHost: string;
  setSmtpHost: (host: string) => void;
  smtpPort: string;
  setSmtpPort: (port: string) => void;
  smtpUser: string;
  setSmtpUser: (user: string) => void;
  smtpPass: string;
  setSmtpPass: (pass: string) => void;
  smtpSecure: boolean;
  setSmtpSecure: (secure: boolean) => void;
  smtpFrom: string;
  setSmtpFrom: (from: string) => void;
}

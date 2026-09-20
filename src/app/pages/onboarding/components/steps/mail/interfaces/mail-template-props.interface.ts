export interface MailTemplateProps {
  smtpType: 'local' | 'remote';
  smtpHost: string;
  smtpPort: string;
  smtpFrom: string;
  onSmtpTypeChange: (value: 'local' | 'remote') => void;
  onSmtpHostChange: (value: string) => void;
  onSmtpPortChange: (value: string) => void;
  onSmtpFromChange: (value: string) => void;
}

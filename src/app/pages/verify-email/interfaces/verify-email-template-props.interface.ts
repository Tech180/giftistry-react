export interface VerifyEmailTemplateProps {
  status: 'loading' | 'success' | 'error';
  errorMessage: string | null;
  handleGoToDashboard: () => void;
  handleGoHome: () => void;
}
export default VerifyEmailTemplateProps;

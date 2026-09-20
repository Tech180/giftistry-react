export interface TemplateProps {
  isLoading: boolean;
  disabled: boolean;
  oauthEnabled: boolean;
  oauthButtonText: string;
  onOauthSignup: () => void;
}

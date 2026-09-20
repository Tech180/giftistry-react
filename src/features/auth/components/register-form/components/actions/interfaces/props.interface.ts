export interface Props {
  isLoading: boolean;
  disabled: boolean;
  oauthEnabled: boolean;
  oauthButtonText: string;
  onOauthSignup: () => void;
}

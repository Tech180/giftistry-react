export interface Props {
  oauthEnabled: boolean;
  setOauthEnabled: (enabled: boolean) => void;
  oauthIssuerUrl: string;
  setOauthIssuerUrl: (url: string) => void;
  oauthClientId: string;
  setOauthClientId: (id: string) => void;
  oauthClientSecret: string;
  setOauthClientSecret: (secret: string) => void;
  oauthAutoRegister: boolean;
  setOauthAutoRegister: (enabled: boolean) => void;
}

export interface SystemStatusResult {
  Initialized?: boolean;
  AllowSetup?: boolean;
  AllowPasswordLogin?: boolean;
  RequireStrongPasswords?: boolean;
  OAuthEnabled?: boolean;
  AiEnabled?: boolean;
  AiWebSearchEnabled?: boolean;
  RegistrationMode?: 'open' | 'invite_only' | 'disabled';
  MaintenanceMode?: boolean;
  MaintenanceMessage?: string;
}

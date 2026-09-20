export interface SystemStatusPatch {
  isSystemInitialized?: boolean;
  allowSetup?: boolean;
  allowPasswordLogin?: boolean;
  requireStrongPasswords?: boolean;
  oauthEnabled?: boolean;
  oauthButtonText?: string;
  globalAiEnabled?: boolean;
  globalWebSearchEnabled?: boolean;
  registrationMode?: 'open' | 'invite_only' | 'disabled';
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
}

export interface SystemStatusPatch {
  isSystemInitialized?: boolean;
  allowSetup?: boolean;
  allowPasswordLogin?: boolean;
  requireStrongPasswords?: boolean;
  oauthEnabled?: boolean;
  globalAiEnabled?: boolean;
  globalWebSearchEnabled?: boolean;
  registrationMode?: 'open' | 'invite_only' | 'disabled';
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
}

import type { SystemStatusResult } from 'features/system';

import type { SystemStatusPatch } from '../interfaces/system-status-patch.interface';

export function applySystemStatus(res: SystemStatusResult | null | undefined): SystemStatusPatch {
  if (!res) {
    return {};
  }

  const patch: SystemStatusPatch = {};

  if (res.Initialized !== undefined) {
    patch.isSystemInitialized = Boolean(res.Initialized);
  }

  if (res.AllowSetup !== undefined) {
    patch.allowSetup = Boolean(res.AllowSetup);
  }

  if (res.AllowPasswordLogin !== undefined) {
    patch.allowPasswordLogin = Boolean(res.AllowPasswordLogin);
  }

  if (res.RequireStrongPasswords !== undefined) {
    patch.requireStrongPasswords = Boolean(res.RequireStrongPasswords);
  }

  if (res.OAuthEnabled !== undefined) {
    patch.oauthEnabled = Boolean(res.OAuthEnabled);
  }

  if (res.AiEnabled !== undefined) {
    patch.globalAiEnabled = Boolean(res.AiEnabled);
  }

  if (res.AiWebSearchEnabled !== undefined) {
    patch.globalWebSearchEnabled = Boolean(res.AiWebSearchEnabled);
  }

  if (res.RegistrationMode) {
    patch.registrationMode = res.RegistrationMode;
  }

  if (res.MaintenanceMode !== undefined) {
    patch.maintenanceMode = Boolean(res.MaintenanceMode);
  }

  if (res.MaintenanceMessage) {
    patch.maintenanceMessage = res.MaintenanceMessage;
  }

  return patch;
}

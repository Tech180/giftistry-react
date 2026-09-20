import type { RegistrationMode } from '../interfaces/registration-mode.type';

export function getClosedMessage(
  registrationMode: RegistrationMode,
  inviteToken: string | null,
): string | undefined {
  if (registrationMode === 'disabled') {
    return 'Registration is currently disabled on this server.';
  }

  if (registrationMode === 'invite_only' && !inviteToken) {
    return 'Registration is invite-only. Use a valid invite link from an administrator.';
  }

  return undefined;
}

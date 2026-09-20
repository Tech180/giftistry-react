import type { SelectMenuOption } from 'shared/ui';
import type { RegistrationMode } from '../interfaces/registration-mode.type';

export const REGISTRATION_MODE_MENU_TITLE = 'Registration mode';

export const REGISTRATION_MODE_OPTIONS: SelectMenuOption[] = [
  {
    value: 'open',
    label: 'Open',
    description: 'Anyone can register',
  },
  {
    value: 'invite_only',
    label: 'Invite only',
    description: 'Signup requires a valid invite link',
  },
  {
    value: 'disabled',
    label: 'Disabled',
    description: 'No new registrations',
  },
];

export const REGISTRATION_MODE_LABELS: Record<RegistrationMode, string> = {
  open: 'Open — anyone can register',
  invite_only: 'Invite only — signup requires a valid invite link',
  disabled: 'Disabled — no new registrations',
};

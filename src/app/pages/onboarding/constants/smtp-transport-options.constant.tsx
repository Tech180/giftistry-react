import type { SelectMenuOption } from 'shared/ui';

export const SMTP_TRANSPORT_MENU_TITLE = 'Transport Protocol';

export const SMTP_TRANSPORT_OPTIONS: SelectMenuOption[] = [
  {
    value: 'local',
    label: 'Local',
    description: 'Mailpit virtual SMTP',
  },
  {
    value: 'remote',
    label: 'Remote SMTP Relay',
    description: 'External mail server',
  },
];

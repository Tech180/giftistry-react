export const REGISTRATION_OPTIONS = [
  {
    value: 'invite_only' as const,
    title: 'Invite Only',
    desc: 'Users must receive a registration invite link to join the workspace.',
    defaultBadge: true,
  },
  {
    value: 'open' as const,
    title: 'Open Registration',
    desc: 'Anyone with the public URL can instantiate an account.',
    defaultBadge: false,
  },
  {
    value: 'disabled' as const,
    title: 'Disabled',
    desc: 'New account creation is turned off until you change this later.',
    defaultBadge: false,
  },
] as const;

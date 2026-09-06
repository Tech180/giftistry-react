import React from 'react';
import { Eye, Pencil } from 'lucide-react';
import type { SelectMenuOption } from 'shared/ui';

export const SHARE_ROLE_MENU_TITLE = 'Select Role';

export const SHARE_ROLE_OPTIONS: SelectMenuOption[] = [
  {
    value: 'viewer',
    label: 'Can View',
    description: 'Read-only access to items.',
    icon: <Eye size={16} aria-hidden />,
  },
  {
    value: 'collaborator',
    label: 'Can Edit',
    description: 'Can add, edit, and mark items.',
    icon: <Pencil size={16} aria-hidden />,
  },
];

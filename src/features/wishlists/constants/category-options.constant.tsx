import type { SelectMenuOption } from 'shared/ui';

export const CATEGORY_MENU_TITLE = 'Category';

export const CATEGORY_OPTIONS: SelectMenuOption[] = [
  { value: 'generic', label: 'General' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'custom', label: 'Custom...' },
];

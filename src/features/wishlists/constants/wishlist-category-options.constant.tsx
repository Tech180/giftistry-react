import type { SelectMenuOption } from 'shared/ui';

export const WISHLIST_CATEGORY_MENU_TITLE = 'Category';

export const WISHLIST_CATEGORY_OPTIONS: SelectMenuOption[] = [
  { value: 'generic', label: 'General' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'custom', label: 'Custom...' },
];

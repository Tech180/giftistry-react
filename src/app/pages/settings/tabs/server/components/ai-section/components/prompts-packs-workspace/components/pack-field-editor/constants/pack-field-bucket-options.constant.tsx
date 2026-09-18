import type { SelectMenuOption } from 'shared/ui';

export const PACK_FIELD_BUCKET_MENU_TITLE = 'Bucket';

export const PACK_FIELD_BUCKET_OPTIONS: SelectMenuOption[] = [
  {
    value: 'userDefined',
    label: 'User-defined',
    description: 'Filled in by the wishlist owner',
  },
  {
    value: 'predefined',
    label: 'Predefined',
    description: 'Fixed values from the pack',
  },
];

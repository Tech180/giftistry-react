import type { Theme } from 'app/providers/interfaces/theme.interface';

export const HOLIDAY_THEMES: { value: Theme; label: string }[] = [
  { value: 'valentines', label: "Valentine's Day" },
  { value: 'st-patricks', label: "St. Patrick's Day" },
  { value: 'earth-day', label: 'Earth Day' },
  { value: 'independence', label: '4th of July' },
  { value: 'halloween', label: 'Halloween' },
  { value: 'thanksgiving', label: 'Thanksgiving' },
  { value: 'christmas', label: 'Christmas' },
];

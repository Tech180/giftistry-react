export type ThemeCategory = 'standard' | 'holiday';

/** Engine-aligned theme registry entry (synced from theming-engine). */
export interface ThemeCatalogEntry {
  id: string;
  label: string;
  category: ThemeCategory;
  /** 0-based month; holiday only */
  unlockMonth?: number;
  /** Inclusive last day of unlock window; holiday only */
  unlockLastDay?: number;
}

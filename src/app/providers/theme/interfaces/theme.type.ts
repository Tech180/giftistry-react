import { THEME_CATALOG } from 'core/theme/constants/theme-catalog.constant';

export type PresetTheme = (typeof THEME_CATALOG)[number]['id'];

/** Preset theme IDs from the engine catalog, plus open-ended custom IDs. */
export type Theme = PresetTheme | (string & {});

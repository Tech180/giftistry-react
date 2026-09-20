import type { ItemAudienceMode } from './item-audience-mode.type';

export interface LinkingAudienceContext {
  mode: ItemAudienceMode;
  sharedWithUserIds: string[];
}

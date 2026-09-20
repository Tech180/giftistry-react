import type { ItemCardProps } from 'features/items';
import type { ItemViewMode } from 'features/items/interfaces/item-view-mode.type';

export type ItemCardRender =
  | { kind: 'skeleton'; viewMode: ItemViewMode }
  | { kind: 'card'; props: ItemCardProps };

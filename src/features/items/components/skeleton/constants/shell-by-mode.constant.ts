import type { ItemViewMode } from '../../../interfaces/item-view-mode.type';
import detailedStyles from '../../views/detailed/view.module.css';
import compactStyles from '../../views/compact/view.module.css';
import gridStyles from '../../views/grid/view.module.css';
import kanbanStyles from '../../views/kanban/view.module.css';
import feedStyles from '../../views/feed/view.module.css';

export const SHELL_BY_MODE: Record<ItemViewMode, string> = {
  compact: compactStyles['view'],
  grid: gridStyles['view'],
  kanban: kanbanStyles['view'],
  feed: feedStyles['view'],
  detailed: detailedStyles['view'],
};

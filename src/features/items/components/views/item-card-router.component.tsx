import React from 'react';
import { ItemViewProps } from '../../interfaces/item-view-props.interface';
import { DetailedItemView } from './detailed/detailed-item-view.html';
import { CompactItemView } from './compact/compact-item-view.html';
import { GridItemView } from './grid/grid-item-view.html';
import { KanbanItemView } from './kanban/kanban-item-view.html';
import { FeedItemView } from './feed/feed-item-view.html';

export const ItemCardRouter: React.FC<ItemViewProps> = (props) => {
  switch (props.viewMode) {
    case 'compact':
      return <CompactItemView {...props} />;
    case 'grid':
      return <GridItemView {...props} />;
    case 'kanban':
      return <KanbanItemView {...props} />;
    case 'feed':
      return <FeedItemView {...props} />;
    case 'detailed':
    default:
      return <DetailedItemView {...props} />;
  }
};

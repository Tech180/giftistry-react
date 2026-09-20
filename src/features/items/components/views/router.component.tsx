import React from 'react';
import { ItemViewProps } from '../../interfaces/item-view-props.interface';
import { View as CompactView } from './compact/view.component';
import { View as DetailedView } from './detailed/view.component';
import { View as FeedView } from './feed/view.component';
import { View as GridView } from './grid/view.component';
import { View as KanbanView } from './kanban/view.component';

export const Router: React.FC<ItemViewProps> = (props) => {
  switch (props.viewMode) {
    case 'compact':
      return <CompactView {...props} />;
    case 'grid':
      return <GridView {...props} />;
    case 'kanban':
      return <KanbanView {...props} />;
    case 'feed':
      return <FeedView {...props} />;
    case 'detailed':
    default:
      return <DetailedView {...props} />;
  }
};

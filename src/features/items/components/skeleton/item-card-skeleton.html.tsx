import React from 'react';
import detailedStyles from '../views/detailed/detailed-item-view.module.css';
import compactStyles from '../views/compact/compact-item-view.module.css';
import gridStyles from '../views/grid/grid-item-view.module.css';
import kanbanStyles from '../views/kanban/kanban-item-view.module.css';
import feedStyles from '../views/feed/feed-item-view.module.css';
import { ItemCardSkeletonTemplateProps } from './interfaces/item-card-skeleton-template-props.interface';
import styles from './item-card-skeleton.module.css';

const bar = (...modifiers: string[]) => ['skeleton', styles.bar, ...modifiers].join(' ');

export const ItemCardSkeletonTemplate: React.FC<ItemCardSkeletonTemplateProps> = ({
  viewMode,
  label,
}) => {
  const shell = { role: 'status', 'aria-busy': true, 'aria-label': label } as const;

  if (viewMode === 'compact') {
    return (
      <div className={compactStyles['v-compact-card']} {...shell}>
        <div className={styles['body-tight']}>
          <div className={styles.row}>
            <span className={bar(styles['bar-title'])} />
            <span className={bar(styles['bar-pill'])} />
          </div>
          <span className={bar(styles['bar-meta'])} />
        </div>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className={gridStyles['gift-card']} {...shell}>
        <span className={`skeleton ${styles.thumb}`} />
        <div className={styles['body-tight']}>
          <span className={bar(styles['bar-title'])} />
          <span className={bar(styles['bar-meta'])} />
        </div>
      </div>
    );
  }

  if (viewMode === 'kanban') {
    return (
      <div className={kanbanStyles['v-kanban-card']} {...shell}>
        <span className={bar(styles['bar-title'])} />
        <span className={bar(styles['bar-line'])} />
        <span className={bar(styles['bar-short'])} />
      </div>
    );
  }

  if (viewMode === 'feed') {
    return (
      <div className={feedStyles['v-feed-item']} {...shell}>
        <div className={feedStyles['v-feed-card']}>
          <div className={styles.row}>
            <span className={`skeleton ${styles.avatar}`} />
            <span className={bar(styles['bar-title'])} />
          </div>
          <span className={bar(styles['bar-line'])} />
          <span className={bar(styles['bar-short'])} />
        </div>
      </div>
    );
  }

  return (
    <div className={detailedStyles['v-detailed-card']} {...shell}>
      <div className={styles.body}>
        <div className={styles.row}>
          <span className={bar(styles['bar-title'])} />
          <span className={bar(styles['bar-pill'])} />
        </div>
        <span className={bar(styles['bar-meta'])} />
        <span className={bar(styles['bar-line'])} />
        <span className={bar(styles['bar-short'])} />
      </div>
    </div>
  );
};

import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';

export const SkeletonTemplate: React.FC<TemplateProps> = ({
  viewMode,
  label,
  shellClassName,
  innerClassName,
  bodyClassName,
  rowClassName,
  barTitleClassName,
  barPillClassName,
  barMetaClassName,
  barLineClassName,
  barShortClassName,
  thumbClassName,
  avatarClassName,
}) => {
  if (viewMode === 'compact') {
    return (
      <div className={shellClassName} role="status" aria-busy={true} aria-label={label}>
        <div className={bodyClassName}>
          <div className={rowClassName}>
            <span className={barTitleClassName} />
            <span className={barPillClassName} />
          </div>
          <span className={barMetaClassName} />
        </div>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className={shellClassName} role="status" aria-busy={true} aria-label={label}>
        <span className={thumbClassName} />
        <div className={bodyClassName}>
          <span className={barTitleClassName} />
          <span className={barMetaClassName} />
        </div>
      </div>
    );
  }

  if (viewMode === 'kanban') {
    return (
      <div className={shellClassName} role="status" aria-busy={true} aria-label={label}>
        <span className={barTitleClassName} />
        <span className={barLineClassName} />
        <span className={barShortClassName} />
      </div>
    );
  }

  if (viewMode === 'feed') {
    return (
      <div className={shellClassName} role="status" aria-busy={true} aria-label={label}>
        <div className={innerClassName}>
          <div className={rowClassName}>
            <span className={avatarClassName} />
            <span className={barTitleClassName} />
          </div>
          <span className={barLineClassName} />
          <span className={barShortClassName} />
        </div>
      </div>
    );
  }

  return (
    <div className={shellClassName} role="status" aria-busy={true} aria-label={label}>
      <div className={bodyClassName}>
        <div className={rowClassName}>
          <span className={barTitleClassName} />
          <span className={barPillClassName} />
        </div>
        <span className={barMetaClassName} />
        <span className={barLineClassName} />
        <span className={barShortClassName} />
      </div>
    </div>
  );
};

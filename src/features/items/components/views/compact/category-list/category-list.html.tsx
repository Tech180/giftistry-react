import React from 'react';
import { ColumnSyncContext } from './hooks/use-column-sync-context';
import type { TemplateProps } from './interfaces/template-props.interface';

export const CategoryListTemplate: React.FC<TemplateProps> = ({
  contextValue,
  containerRef,
  id,
  rootClassName,
  style,
  items,
  children,
}) => (
  <ColumnSyncContext.Provider value={contextValue}>
    <div
      ref={containerRef}
      id={id}
      className={rootClassName}
      style={style}
    >
      {items.map((item) => children(item))}
    </div>
  </ColumnSyncContext.Provider>
);

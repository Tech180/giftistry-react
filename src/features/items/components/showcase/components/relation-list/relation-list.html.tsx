import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';

export const RelationListTemplate: React.FC<TemplateProps> = ({
  title,
  items,
  sectionClassName,
  labelClassName,
  listClassName,
  itemClassName,
  statusClassName,
}) => (
  <div className={sectionClassName}>
    <span className={labelClassName}>{title}</span>
    <ul className={listClassName}>
      {items.map((item) => (
        <li key={item.id} className={itemClassName}>
          <span>{item.name}</span>
          <span className={statusClassName}>{item.statusLabel}</span>
        </li>
      ))}
    </ul>
  </div>
);

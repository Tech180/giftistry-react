import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';

export const MetaBadgesTemplate: React.FC<TemplateProps> = ({
  entries,
  sectionTitle,
  sectionVariant,
  sectionClassName,
  labelClassName,
  listClassName,
  badgeClassName,
}) => (
  <div className={sectionClassName}>
    {sectionVariant === 'inline' ? (
      <span className={labelClassName}>{sectionTitle}</span>
    ) : (
      <h4 className={labelClassName}>{sectionTitle}</h4>
    )}
    <div className={listClassName}>
      {entries.map((entry) => (
        <span key={entry.label} className={badgeClassName}>
          {entry.emoji ? `${entry.emoji} ` : ''}
          {entry.label}: {entry.value}
        </span>
      ))}
    </div>
  </div>
);

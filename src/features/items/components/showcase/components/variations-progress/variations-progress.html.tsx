import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';

export const VariationsProgressTemplate: React.FC<TemplateProps> = ({
  variations,
  sectionTitle,
  sectionVariant,
  sectionClassName,
  labelClassName,
  listClassName,
  cardClassName,
  headerClassName,
  nameClassName,
  qtyClassName,
  barBgClassName,
  barFillClassName,
}) => (
  <div className={sectionClassName}>
    {sectionVariant === 'inline' ? (
      <span className={labelClassName}>{sectionTitle}</span>
    ) : (
      <h4 className={labelClassName}>{sectionTitle}</h4>
    )}
    <div className={listClassName}>
      {variations.map((variation) => (
        <div key={variation.name} className={cardClassName}>
          <div className={headerClassName}>
            <span className={nameClassName}>{variation.name}</span>
            <span className={qtyClassName}>{variation.qtyLabel}</span>
          </div>
          <div className={barBgClassName}>
            <div className={barFillClassName} style={{ width: `${variation.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

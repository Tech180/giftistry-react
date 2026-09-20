import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';

export const QuantityBadgeTemplate: React.FC<TemplateProps> = ({
  label,
  title,
  ariaLabel,
  className,
}) => {
  return (
    <span className={className} title={title} aria-label={ariaLabel}>
      {label}
    </span>
  );
};

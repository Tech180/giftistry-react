import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';

export const PriorityDisplayTemplate: React.FC<TemplateProps> = ({
  priority,
  showHint,
  rootClassName,
  labelClassName,
  valueClassName,
  hintClassName,
  ariaLabel,
}) => {
  return (
    <div className={rootClassName} aria-label={ariaLabel}>
      <span className={labelClassName}>Priority:</span>
      <span className={valueClassName}>{priority}</span>
      {showHint ? <span className={hintClassName}>(1 is highest)</span> : null}
    </div>
  );
};

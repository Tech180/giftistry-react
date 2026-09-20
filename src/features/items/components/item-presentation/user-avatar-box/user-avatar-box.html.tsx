import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';

export const UserAvatarBoxTemplate: React.FC<TemplateProps> = ({
  title,
  ariaLabel,
  children,
  rootClassName,
  titleClassName,
  bodyClassName,
}) => {
  return (
    <div className={rootClassName} aria-label={ariaLabel}>
      <span className={titleClassName}>{title}</span>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

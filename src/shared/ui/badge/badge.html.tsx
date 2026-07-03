import React from 'react';
import { BadgeTemplateProps } from './interfaces/badge-template-props.interface';

export const BadgeTemplate: React.FC<BadgeTemplateProps> = ({
  children,
  badgeClass,
}) => {
  return <span className={badgeClass}>{children}</span>;
};

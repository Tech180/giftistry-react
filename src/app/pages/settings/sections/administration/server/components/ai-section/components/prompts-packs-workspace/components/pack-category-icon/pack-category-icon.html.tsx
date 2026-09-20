import React from 'react';
import type { PackCategoryIconTemplateProps } from './interfaces/template-props.interface';

export const PackCategoryIconTemplate: React.FC<PackCategoryIconTemplateProps> = ({ Icon, size }) => {
  return <Icon size={size} aria-hidden="true" />;
};

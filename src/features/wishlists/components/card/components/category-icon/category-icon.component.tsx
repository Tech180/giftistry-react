import React from 'react';
import type { Props } from './interfaces/props.interface';
import { CategoryIconTemplate } from './category-icon.html';

export const CategoryIcon: React.FC<Props> = ({ category, className }) => {
  return (
    <CategoryIconTemplate
      category = {
        category
      }
      className = {
        className
      }
    />
  );
};

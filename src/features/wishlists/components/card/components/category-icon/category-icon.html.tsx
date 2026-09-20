import React from 'react';
import { Cake, TreePine, Heart, List } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';

export const CategoryIconTemplate: React.FC<TemplateProps> = ({ category, className }) => {
  switch (category?.toLowerCase()) {
    case 'birthday':
      return <Cake className={className} />;
    case 'holiday':
      return <TreePine className={className} />;
    case 'wedding':
      return <Heart className={className} />;
    default:
      return <List className={className} />;
  }
};

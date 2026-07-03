import React from 'react';
import { Cake, TreePine, Heart, List } from 'lucide-react';

interface WishlistCategoryIconProps {
  category?: string;
  className?: string;
}

export const WishlistCategoryIcon: React.FC<WishlistCategoryIconProps> = ({ category, className }) => {
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

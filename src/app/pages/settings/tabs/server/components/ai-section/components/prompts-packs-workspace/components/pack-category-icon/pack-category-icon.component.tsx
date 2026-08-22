import React from 'react';
import { Cpu, Package } from 'lucide-react';
import type { PackCategoryIconProps } from './interfaces/pack-category-icon-props.interface';
import { PackCategoryIconTemplate } from './pack-category-icon.html';

export const PackCategoryIcon: React.FC<PackCategoryIconProps> = ({ isTechnology, size = 18 }) => {
  return <PackCategoryIconTemplate Icon={isTechnology ? Cpu : Package} size={size} />;
};

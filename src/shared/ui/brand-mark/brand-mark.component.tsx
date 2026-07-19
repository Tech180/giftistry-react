import React from 'react';
import { BrandMarkProps } from './interfaces/brand-mark-props.interface';
import { BrandMarkTemplate } from './brand-mark.html';
import styles from './brand-mark.module.css';

export type { BrandMarkProps } from './interfaces/brand-mark-props.interface';

export const BrandMark: React.FC<BrandMarkProps> = ({
  size = 'md',
  showLabel = true,
  to,
  className = '',
}) => {
  const rootClass = [styles.root, styles[`size-${size}`]].filter(Boolean).join(' ');
  const iconSize = size === 'sm' ? 16 : 20;

  return (
    <BrandMarkTemplate
      size={size}
      showLabel={showLabel}
      to={to}
      className={className}
      rootClass={rootClass}
      iconSize={iconSize}
    />
  );
};

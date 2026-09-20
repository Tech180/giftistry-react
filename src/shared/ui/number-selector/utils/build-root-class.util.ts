import type { NumberSelectorProps } from '../interfaces/number-selector-props.interface';
import styles from '../number-selector.module.css';

export const buildRootClass = ({
  size = 'md',
  className = '',
}: Pick<NumberSelectorProps, 'size' | 'className'>) =>
  [
    styles['number-selector'],
    size === 'sm' ? styles['number-selector-sm'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

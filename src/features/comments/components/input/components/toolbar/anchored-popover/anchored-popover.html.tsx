import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './anchored-popover.module.css';

export const AnchoredPopoverTemplate: React.FC<TemplateProps> = ({
  popoverRef,
  className,
  style,
  placement,
  children,
}) => (
  <div
    ref={popoverRef}
    className={[styles['anchored-popover'], className].filter(Boolean).join(' ')}
    style={style}
    data-placement={placement}
  >
    {children}
  </div>
);

import React from 'react';
import type { GlowCardTemplateProps } from './interfaces/glow-card-template-props.interface';
import styles from './glow-card.module.css';

export const GlowCardTemplate: React.FC<GlowCardTemplateProps> = ({
  selected,
  as,
  type = 'button',
  onClick,
  onMouseMove,
  children,
  className,
  role,
  contentPassive = true,
}) => {
  const rootClass = [
    styles['glow-card'],
    selected ? styles['glow-card--selected'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const contentClass = [
    styles['glow-card__content'],
    contentPassive ? styles['glow-card__content--passive'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (as === 'button') {
    return (
      <button
        type={type}
        className={rootClass}
        onClick={onClick}
        onMouseMove={onMouseMove}
      >
        <div className={contentClass}>{children}</div>
      </button>
    );
  }

  return (
    <div className={rootClass} onMouseMove={onMouseMove} role={role} onClick={onClick}>
      <div className={contentClass}>{children}</div>
    </div>
  );
};

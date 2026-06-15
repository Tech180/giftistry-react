import React from 'react';
import { CardProps } from 'shared/interfaces/card-props.interface';
import { CardTemplate } from './card.html';
import styles from './card.module.css';

export type { CardProps } from 'shared/interfaces/card-props.interface';

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  glass = true,
  padding = 'md',
  className = '',
  ...props
}) => {
  const cardClass = [
    styles.card,
    glass ? styles.glass : styles.flat,
    hoverable ? styles.hoverable : '',
    styles[padding],
    className,
  ].filter(Boolean).join(' ');

  return (
    <CardTemplate
      cardClass={cardClass}
      hoverable={hoverable}
      glass={glass}
      padding={padding}
      className={className}
      {...props}
    >
      {children}
    </CardTemplate>
  );
};

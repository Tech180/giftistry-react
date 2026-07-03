import React from 'react';
import { CardTemplateProps } from './interfaces/card-template-props.interface';

export const CardTemplate: React.FC<CardTemplateProps> = ({
  children,
  cardClass,
  hoverable,
  glass,
  padding,
  className,
  ...props
}) => {
  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

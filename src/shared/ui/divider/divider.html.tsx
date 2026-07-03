import React from 'react';
import { DividerTemplateProps } from './interfaces/divider-template-props.interface';

export const DividerTemplate: React.FC<DividerTemplateProps> = ({
  orientation,
  dividerClass,
}) => {
  return (
    <div
      className={dividerClass}
      role="separator"
      aria-orientation={orientation}
    />
  );
};

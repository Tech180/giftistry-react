import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';

export const PhotoTemplate: React.FC<TemplateProps> = ({
  imageUrl,
  rootClassName,
  imageClassName,
}) => (
  <div className={rootClassName}>
    <img src={imageUrl} alt="" className={imageClassName} />
  </div>
);

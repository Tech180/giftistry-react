import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';

export const EnterPanelTemplate: React.FC<TemplateProps> = ({
  Tag,
  className,
  children,
  elementRef,
  ...props
}) => (
  <Tag
    ref = {
      elementRef as React.Ref<HTMLElement>
    }
    className = {
      className
    }
    {...props}
  >
    {children}
  </Tag>
);

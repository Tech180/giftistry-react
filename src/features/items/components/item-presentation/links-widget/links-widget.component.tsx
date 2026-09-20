import React from 'react';
import type { Props } from './interfaces/props.interface';
import { LinksWidgetTemplate } from './links-widget.html';

export const LinksWidget: React.FC<Props> = (props) => {
  return (
    <LinksWidgetTemplate
      {...props}
    />
  );
};

import React from 'react';
import type { Props } from './interfaces/props.interface';
import { ContentTemplate } from './content.html';

export const Content: React.FC<Props> = (props) => (
  <ContentTemplate {...props} />
);

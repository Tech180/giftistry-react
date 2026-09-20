import React from 'react';
import type { Props } from './interfaces/props.interface';
import { TimelineTemplate } from './timeline.html';

export const Timeline: React.FC<Props> = (props) => {
  return <TimelineTemplate {...props} />;
};

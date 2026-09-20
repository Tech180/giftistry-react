import React from 'react';
import type { Props } from './interfaces/props.interface';
import { OverlaysTemplate } from './overlays.html';

export const Overlays: React.FC<Props> = (props) => (
  <OverlaysTemplate
    {...props}
  />
);

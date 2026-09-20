import React from 'react';
import type { Props } from './interfaces/props.interface';
import { ToggleTemplate } from './toggle.html';

export const Toggle: React.FC<Props> = (props) => (
  <ToggleTemplate {...props} />
);

import React from 'react';
import type { Props } from './interfaces/props.interface';
import { PrimaryRowTemplate } from './primary-row.html';

export const PrimaryRow: React.FC<Props> = (props) => (
  <PrimaryRowTemplate
    {...props}
  />
);

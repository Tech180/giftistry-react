import React from 'react';
import type { Props } from './interfaces/props.interface';
import { HeaderTemplate } from './header.html';

export const Header: React.FC<Props> = (props) => (
  <HeaderTemplate {...props} />
);

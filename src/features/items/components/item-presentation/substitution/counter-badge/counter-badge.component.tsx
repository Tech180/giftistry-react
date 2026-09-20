import React from 'react';
import type { Props } from './interfaces/props.interface';
import { CounterBadgeTemplate } from './counter-badge.html';

export const CounterBadge: React.FC<Props> = (props) => {
  return (
    <CounterBadgeTemplate
      {...props}
    />
  );
};

import React from 'react';
import type { Props } from './interfaces/props.interface';
import { UnreachableTemplate } from './unreachable.html';

export const Unreachable: React.FC<Props> = (props) => {
  return (
    <UnreachableTemplate
      onRetry = {
        props.onRetry
      }
    />
  );
};

import React from 'react';
import type { Props } from './interfaces/props.interface';
import { LinkedSquaresTemplate } from './linked-squares.html';

export const LinkedSquares: React.FC<Props> = (props) => {
  return <LinkedSquaresTemplate {...props} />;
};

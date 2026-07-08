import React from 'react';
import { LinkedItemSquaresProps } from './interfaces/linked-item-squares-props.interface';
import { LinkedItemSquaresTemplate } from './linked-item-squares.html';

export const LinkedItemSquares: React.FC<LinkedItemSquaresProps> = (props) => {
  return <LinkedItemSquaresTemplate {...props} />;
};

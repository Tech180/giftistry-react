import React from 'react';
import { PaginationControlsTemplate } from './pagination-controls.html';
import { PaginationControlsProps } from './interfaces/pagination-controls-props.interface';

export const PaginationControls: React.FC<PaginationControlsProps> = (props) => (
  <PaginationControlsTemplate {...props} />
);

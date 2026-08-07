import React from 'react';
import type { RowProps } from './interfaces/row-props.interface';
import { RowTemplate } from './row.html';

export const Row: React.FC<RowProps> = (props) => {
  return <RowTemplate {...props} />;
};

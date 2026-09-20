import React from 'react';
import type { Props } from './interfaces/props.interface';
import { SecondaryRowTemplate } from './secondary-row.html';

export const SecondaryRow: React.FC<Props> = (props) => {
  if (!props.showSecondaryRow) {
    return null;
  }

  return (
    <SecondaryRowTemplate
      {...props}
    />
  );
};

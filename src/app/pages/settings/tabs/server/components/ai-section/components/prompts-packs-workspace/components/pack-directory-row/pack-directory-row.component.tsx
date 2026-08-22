import React from 'react';
import type { PackDirectoryRowProps } from './interfaces/pack-directory-row-props.interface';
import { PackDirectoryRowTemplate } from './pack-directory-row.html';

export const PackDirectoryRow: React.FC<PackDirectoryRowProps> = (props) => {
  return (
    <PackDirectoryRowTemplate
      {...props}
      viewAriaLabel={`View ${props.pack.Label}`}
      toggleAriaLabel={`Toggle ${props.pack.Label}`}
    />
  );
};

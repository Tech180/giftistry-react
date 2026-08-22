import React from 'react';
import type { PackDetailPaneProps } from './interfaces/pack-detail-pane-props.interface';
import { PackDetailPaneTemplate } from './pack-detail-pane.html';

export const PackDetailPane: React.FC<PackDetailPaneProps> = ({ pack, ...props }) => {
  return (
    <PackDetailPaneTemplate
      {...props}
      pack={pack}
      isCustom={pack.IsCustom}
      toggleAriaLabel={`Toggle ${pack.Label}`}
    />
  );
};

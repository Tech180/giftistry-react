import React from 'react';
import type { PanelProps } from './interfaces/panel-props.interface';
import { PanelTemplate } from './panel.html';

export const Panel: React.FC<PanelProps> = (props) => {
  return <PanelTemplate {...props} />;
};

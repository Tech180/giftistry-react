import React from 'react';
import type { Props } from './interfaces/props.interface';
import { AiPanelTemplate } from './ai-panel.html';

export const AiPanel: React.FC<Props> = (props) => {
  return (
    <AiPanelTemplate
      active = { props.active }
      grabSwitchId = { props.grabSwitchId }
      optimizeSwitchId = { props.optimizeSwitchId }
      grabArmed = { props.grabArmed }
      optimizeArmed = { props.optimizeArmed }
      canOptimizeCategories = { props.canOptimizeCategories }
      disabled = { props.disabled }
      onGrabChange = { props.onGrabChange }
      onOptimizeChange = { props.onOptimizeChange }
    />
  );
};

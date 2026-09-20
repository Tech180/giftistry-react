import React from 'react';
import type { Props } from './interfaces/props.interface';
import { AiReviewsPanelTemplate } from './ai-reviews-panel.html';

export const AiReviewsPanel: React.FC<Props> = (props) => {
  return (
    <AiReviewsPanelTemplate
      {...props}
    />
  );
};

import React from 'react';
import { AiSectionProps } from '../../interfaces/ai-section-props.interface';
import { AiSectionTemplate } from './ai-section.html';

export const AiSection: React.FC<AiSectionProps> = (props) => {
  return <AiSectionTemplate {...props} />;
};
export default AiSection;

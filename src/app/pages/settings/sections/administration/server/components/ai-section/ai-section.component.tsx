import React from 'react';
import type { AiSectionProps } from './interfaces/props.interface';
import { AiSectionTemplate } from './ai-section.html';
import { useSection } from './hooks/use-section';

export type { AiSectionProps };

export const AiSection: React.FC<AiSectionProps> = (props) => {
  const templateProps = useSection(props);
  return <AiSectionTemplate {...templateProps} />;
};

export default AiSection;

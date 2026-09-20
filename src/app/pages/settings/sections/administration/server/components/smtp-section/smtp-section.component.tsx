import React from 'react';
import type { SmtpSectionProps } from './interfaces/props.interface';
import { SmtpSectionTemplate } from './smtp-section.html';

export const SmtpSection: React.FC<SmtpSectionProps> = (props) => {
  return <SmtpSectionTemplate {...props} />;
};
export default SmtpSection;

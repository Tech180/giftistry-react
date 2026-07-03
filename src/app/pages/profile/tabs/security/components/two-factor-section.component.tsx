import React from 'react';
import { TwoFactorSectionProps } from '../interfaces/two-factor-section-props.interface';
import { TwoFactorSectionTemplate } from './two-factor-section.html';

export const TwoFactorSection: React.FC<TwoFactorSectionProps> = (props) => {
  return <TwoFactorSectionTemplate {...props} />;
};

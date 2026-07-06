import React from 'react';
import { PasskeysSectionProps } from '../interfaces/passkeys-section-props.interface';
import { PasskeysSectionTemplate } from './passkeys-section.html';

export const PasskeysSection: React.FC<PasskeysSectionProps> = (props) => {
  return <PasskeysSectionTemplate {...props} />;
};

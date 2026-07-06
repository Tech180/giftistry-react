import React from 'react';
import { PasswordSectionProps } from '../interfaces/password-section-props.interface';
import { PasswordSectionTemplate } from './password-section.html';

export const PasswordSection: React.FC<PasswordSectionProps> = (props) => {
  return <PasswordSectionTemplate {...props} />;
};

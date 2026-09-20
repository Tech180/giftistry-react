import React from 'react';
import type { RegistrationProps } from './interfaces/registration-props.interface';
import { RegistrationTemplate } from './registration.html';

export const Registration: React.FC<RegistrationProps> = (props) => (
  <RegistrationTemplate {...props} />
);

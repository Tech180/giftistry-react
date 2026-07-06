import React from 'react';
import { WarningProps } from './interfaces/warning-props.interface';
import { WarningTemplate } from './warning.html';

export const OwnerWarning: React.FC<WarningProps> = (props) => (
  <WarningTemplate {...props} />
);

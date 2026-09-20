import React from 'react';
import type { Props } from './interfaces/props.interface';
import { ClaimAnonymousToggleTemplate } from './claim-anonymous-toggle.html';

export const ClaimAnonymousToggle: React.FC<Props> = (props) => {
  return (
    <ClaimAnonymousToggleTemplate
      {...props}
    />
  );
};

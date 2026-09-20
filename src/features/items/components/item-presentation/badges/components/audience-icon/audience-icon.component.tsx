import React from 'react';
import type { Props } from './interfaces/props.interface';
import { AudienceIconTemplate } from './audience-icon.html';

export const AudienceIcon: React.FC<Props> = ({ kind }) => {
  return (
    <AudienceIconTemplate
      kind = {
        kind
      }
    />
  );
};

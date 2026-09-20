import React from 'react';
import type { Props } from './interfaces/props.interface';
import { SubstitutionSlotTemplate } from './substitution-slot.html';

export const SubstitutionSlot: React.FC<Props> = (props) => {
  return (
    <SubstitutionSlotTemplate
      {...props}
    />
  );
};

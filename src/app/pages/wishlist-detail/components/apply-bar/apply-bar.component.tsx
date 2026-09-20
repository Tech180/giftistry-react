import React from 'react';
import type { Props } from './interfaces/props.interface';
import { ApplyBarTemplate } from './apply-bar.html';

export const ApplyBar: React.FC<Props> = ({
  onApply,
}) => (
  <ApplyBarTemplate
    onApply = {
      onApply
    }
  />
);

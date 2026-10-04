import React from 'react';
import type { Props } from './interfaces/props.interface';
import { ApplyBarTemplate } from './apply-bar.html';

export const ApplyBar: React.FC<Props> = ({
  buttonLabel,
  onApply,
}) => (
  <ApplyBarTemplate
    buttonLabel = {
      buttonLabel
    }
    onApply = {
      onApply
    }
  />
);

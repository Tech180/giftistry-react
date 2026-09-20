import React from 'react';
import type { Props } from './interfaces/props.interface';
import { RemoveModalTemplate } from './remove-modal.html';

export const RemoveModal: React.FC<Props> = (props) => (
  <RemoveModalTemplate {...props} />
);

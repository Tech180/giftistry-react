import React from 'react';
import type { Props } from './interfaces/props.interface';
import { VariationsTemplate } from './variations.html';

export const Variations: React.FC<Props> = (props) => <VariationsTemplate {...props} />;

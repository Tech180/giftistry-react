import React from 'react';
import type { Props } from './interfaces/props.interface';
import { GiphySectionTemplate } from './giphy-section.html';

export const GiphySection: React.FC<Props> = (props) => <GiphySectionTemplate {...props} />;

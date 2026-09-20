import React from 'react';
import type { Props } from './interfaces/props.interface';
import { CoreDetailsTemplate } from './core-details.html';

export const CoreDetails: React.FC<Props> = (props) => <CoreDetailsTemplate {...props} />;

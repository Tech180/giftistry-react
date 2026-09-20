import React from 'react';
import type { Props } from './interfaces/props.interface';
import { PublicUrlTemplate } from './public-url.html';

export const PublicUrl: React.FC<Props> = (props) => <PublicUrlTemplate {...props} />;

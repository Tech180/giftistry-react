import React from 'react';
import type { PublicUrlProps } from './interfaces/public-url-props.interface';
import { PublicUrlTemplate } from './public-url.html';

export const PublicUrl: React.FC<PublicUrlProps> = (props) => <PublicUrlTemplate {...props} />;

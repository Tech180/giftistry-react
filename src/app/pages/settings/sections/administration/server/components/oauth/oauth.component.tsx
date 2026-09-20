import React from 'react';
import type { Props } from './interfaces/props.interface';
import { OauthTemplate } from './oauth.html';

export const Oauth: React.FC<Props> = (props) => <OauthTemplate {...props} />;

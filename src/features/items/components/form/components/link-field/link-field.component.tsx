import React from 'react';
import type { Props } from './interfaces/props.interface';
import { LinkFieldTemplate } from './link-field.html';

export const LinkField: React.FC<Props> = (props) => <LinkFieldTemplate {...props} />;

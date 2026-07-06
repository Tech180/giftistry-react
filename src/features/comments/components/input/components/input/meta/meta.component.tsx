import React from 'react';
import { MetaProps } from './interfaces/meta-props.interface';
import { MetaTemplate } from './meta.html';

export const MetaRow: React.FC<MetaProps> = (props) => <MetaTemplate {...props} />;

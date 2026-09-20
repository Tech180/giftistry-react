import React from 'react';
import type { Props } from './interfaces/props.interface';
import { CategoriesTemplate } from './categories.html';

export const Categories: React.FC<Props> = (props) => <CategoriesTemplate {...props} />;

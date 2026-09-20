import React from 'react';
import type { ThemeProps } from './interfaces/theme-props.interface';
import { ThemeTemplate } from './theme.html';

export const Theme: React.FC<ThemeProps> = (props) => <ThemeTemplate {...props} />;

import React from 'react';
import type { HeaderProps } from './interfaces/header-props.interface';
import { HeaderTemplate } from './header.html';

export const Header: React.FC<HeaderProps> = (props) => <HeaderTemplate {...props} />;

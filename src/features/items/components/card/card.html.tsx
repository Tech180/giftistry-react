import React from 'react';
import type { ItemViewProps } from '../../interfaces/item-view-props.interface';
import { Router } from '../views/router.component';

export const CardTemplate: React.FC<ItemViewProps> = (props) => <Router {...props} />;
